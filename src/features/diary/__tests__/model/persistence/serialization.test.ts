import { readFileSync } from 'fs';
import { join } from 'path';
import { container, DependencyContainer } from 'tsyringe';
import { compressToEncodedURIComponent } from 'lz-string';
import '@features/diary/container/di_diary';
import DIARY_CONSTANTS from '@features/diary/constants';
import { IDiary } from '@features/diary/model/diaryModelInterfaces';
import {
  compressDiary,
  DiaryDecompressor,
} from '@features/diary/services/serialization/diarySerializer';
import {
  DecompressionError,
  InvalidJsonError,
  NotSupportedError,
} from '@lib/error';

describe('diary serialization with production factories', () => {
  let testContainer: DependencyContainer;
  let decompressor: DiaryDecompressor;

  beforeEach(() => {
    testContainer = container.createChildContainer();
    testContainer.registerInstance('STORAGE_KEY', 'round-trip-key');
    decompressor = testContainer.resolve(DiaryDecompressor);
  });

  it('compresses the JSON representation of a diary', () => {
    const diary = testContainer.resolve<IDiary>('IDiary');
    diary.getEntry(1).setTitle('1日目');
    diary.getEntry(1).setContent('1日目の記録');
    const day = diary.createNewEntry();
    diary.getEntry(day).setContent('2日目の記録');
    expect(compressDiary(diary)).toBe(
      compressToEncodedURIComponent(JSON.stringify(diary))
    );
  });

  it.each([0, 1])('restores the saved v%s fixture', (version) => {
    const file = readFileSync(
      join(__dirname, '../../__mocks__', `testFileV${version}.txt`),
      'utf8'
    );
    const diary = decompressor.decompressDiary(file);

    expect(diary.getSettings().version).toBe(DIARY_CONSTANTS.CURRENT_VERSION);
    expect(diary.getSettings().storageKey).toBe(
      '726af4c3-30f9-4076-a42e-4645af041097'
    );
    expect(diary.getLastDay()).toBe(5);
    expect(Array.from(diary.collectEntryDays())).toEqual([1, 2, 3, 4, 5]);
    for (let day = 1; day <= 5; day++) {
      const entry = diary.getEntry(day);
      expect(entry.getTitle()).toBe(`${day}日目`);
      expect(entry.getContent()).toBe(`test${day}`);
      expect(entry.previous).toBe(day > 1 ? day - 1 : undefined);
      expect(entry.next).toBe(day < 5 ? day + 1 : undefined);
    }
  });

  it('preserves settings, entries, and links through a round trip', () => {
    const diary = testContainer.resolve<IDiary>('IDiary');
    const settings = diary.getSettings();
    settings.setDiaryName('日本語の日記');
    settings.updateDayInterval(3);
    settings.setModifier('$Y年$C$D日（$N日目）');
    settings.updateCycleLength(15);
    ['春', '夏', '秋', '冬'].forEach((unit, i) =>
      settings.updateModifierUnit(unit, i)
    );
    diary.getEntry(1).setTitle('開始🌸');
    diary.getEntry(1).setContent('改行\nと記号 " \\ を含む記録');
    for (let i = 0; i < 2; i++) {
      const day = diary.createNewEntry();
      diary.getEntry(day).setContent(`${day}日目の記録`);
    }

    const restored = decompressor.decompressDiary(compressDiary(diary));
    expect(JSON.parse(JSON.stringify(restored))).toEqual(
      JSON.parse(JSON.stringify(diary))
    );
    expect(restored.getSettings().getDiaryName()).toBe('日本語の日記');
    expect(restored.getSettings().getDayInterval()).toBe(3);
    expect(restored.getSettings().getCycleLength()).toBe(15);
    expect(restored.getSettings().getModifier()).toBe('$Y年$C$D日（$N日目）');
    expect(
      [0, 1, 2, 3].map((i) => restored.getSettings().getModifierUnit(i))
    ).toEqual(['春', '夏', '秋', '冬']);
    expect(restored.getLastDay()).toBe(7);
    expect(restored.getEntry(1).previous).toBeUndefined();
    expect(restored.getEntry(4).previous).toBe(1);
    expect(restored.getEntry(7).previous).toBe(4);
    expect(restored.getEntry(7).next).toBeUndefined();
  });

  it.each([null, [], 1, 'diary', false])(
    'rejects a non-diary JSON value: %p',
    (value) => {
      expect(() =>
        decompressor.decompressDiary(
          compressToEncodedURIComponent(JSON.stringify(value))
        )
      ).toThrow(InvalidJsonError);
    }
  );

  it.each([{}, { settings: null }, { settings: 'settings' }])(
    'rejects missing or invalid settings: %p',
    (value) => {
      expect(() =>
        decompressor.decompressDiary(
          compressToEncodedURIComponent(JSON.stringify(value))
        )
      ).toThrow(InvalidJsonError);
    }
  );

  it('rejects invalid compressed data', () => {
    expect(() => decompressor.decompressDiary('invalid')).toThrow(
      DecompressionError
    );
  });

  it('rejects invalid JSON', () => {
    expect(() =>
      decompressor.decompressDiary(compressToEncodedURIComponent('{broken'))
    ).toThrow(SyntaxError);
  });

  it('rejects unsupported versions', () => {
    expect(() =>
      decompressor.decompressDiary(
        compressToEncodedURIComponent(
          JSON.stringify({ settings: { _version: 99 } })
        )
      )
    ).toThrow(new NotSupportedError('version=v99 is not supported'));
  });
});
