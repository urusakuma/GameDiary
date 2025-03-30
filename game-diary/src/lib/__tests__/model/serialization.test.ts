import { DayModifier } from '@/model/diary/dayModifier';
import { Diary } from '@/model/diary/diary';
import { DiaryEntry } from '@/model/diary/diaryEntry';
import {
  DayModifierFactory,
  UseExistingDataDiaryEntryFactory,
  DiaryFactory,
  UseExistingDataDiarySettingsFactory,
  IDayModifier,
  IDiaryEntry,
  IDiarySettings,
  IDiary,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { DiarySettings } from '@/model/diary/diarySettings';
import {
  compressDiary,
  DiaryDecompressor,
} from '@/model/serialization/diarySerializer';
import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import {
  CheckedType,
  hasField,
  isArrayType,
  isTypeMatch,
} from '@/model/utils/checkTypeMatch';
import { readFileSync } from 'fs';
import { container } from 'tsyringe';
import { MockDiarySettings } from '../__mocks__/mockDiarySettings';
import { MockDiaryEntry } from '../__mocks__/mockDiaryEntry';
import { compressToEncodedURIComponent } from 'lz-string';

describe('serialization test', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register<DayModifierFactory>('DayModifierFactory', {
      useFactory:
        () =>
        (modifier: string, cycleLength: number, ...unit: Array<string>) =>
          new DayModifier(modifier, cycleLength, ...unit),
    });
    container.register<UseExistingDataDiarySettingsFactory>(
      'UseExistingDataDiarySettingsFactory',
      {
        useFactory:
          () =>
          (
            dayModifier: IDayModifier,
            DiaryName: string,
            dayInterval: number,
            storageKey: string,
            version: number
          ) =>
            new DiarySettings(
              dayModifier,
              DiaryName,
              dayInterval,
              storageKey,
              version
            ),
      }
    );
    container.register<UseExistingDataDiaryEntryFactory>(
      'UseExistingDataDiaryEntryFactory',
      {
        useFactory:
          () =>
          (
            day: number,
            title: string,
            content: string,
            previous: number | undefined,
            next: number | undefined
          ) =>
            new DiaryEntry(day, title, content, previous, next),
      }
    );
    container.register<DiaryFactory>('DiaryFactory', {
      useFactory:
        () =>
        (
          diaryEntries: Map<number, IDiaryEntry>,
          settings: IDiarySettings,
          lastDay: number
        ) =>
          new Diary(
            container.resolve('UseExistingDataDiaryEntryFactory'),
            diaryEntries,
            settings,
            lastDay
          ),
    });
    container.register<IDiaryDecompressor>('IDiaryDecompressor', {
      useClass: DiaryDecompressor,
    });
    container.register<number>('FirstDay', {
      useValue: 1,
    });
    container.register<IDiaryEntry>('IDiaryEntry', {
      useClass: MockDiaryEntry,
    });
    container.register<Map<number, IDiaryEntry>>(
      'DiaryEntriesContainingFirstDay',
      {
        useValue: new Map<number, IDiaryEntry>().set(
          container.resolve('FirstDay'),
          container.resolve('IDiaryEntry')
        ),
      }
    );
    container.register('MockKey', { useFactory: () => undefined });
    container.register<IDiarySettings>('IDiarySettings', {
      useClass: MockDiarySettings,
    });
    container.register<UsePreviousDayDiaryEntryFactory>(
      'UsePreviousDayDiaryEntryFactory',
      {
        useFactory: () => (source: IDiaryEntry, settings: IDiarySettings) => {
          const newDay = settings.getNextDay(source.day);
          return new DiaryEntry(
            newDay,
            settings.getModifierDay(newDay),
            '',
            source.day,
            undefined
          );
        },
      }
    );
    container.register<IDiary>('IDiary', { useClass: Diary });
  });
  test('checkTypeMatch', () => {
    const testCases: { value: unknown; expectedType: CheckedType }[] = [
      { value: false, expectedType: 'boolean' },
      { value: 0, expectedType: 'number' },
      { value: '文字列', expectedType: 'string' },
      { value: new Object(), expectedType: 'object' },
    ];
    testCases.forEach(({ value, expectedType }) => {
      const allTypes: CheckedType[] = ['object', 'string', 'number', 'boolean'];
      expect(isTypeMatch(value, expectedType)).toBeTruthy();
      allTypes
        .filter((type) => type !== expectedType)
        .forEach((wrongType) => {
          expect(isTypeMatch(value, wrongType)).toBeFalsy();
        });
    });
    expect(isTypeMatch([0, 1, 2, 3, 4, 5], 'Array')).toBeTruthy();
    expect(isTypeMatch({ key: 'value' }, 'record')).toBeTruthy();
    expect(isTypeMatch(new Object(), 'Array')).toBeFalsy();
    expect(isTypeMatch(new Map(), 'Array')).toBeFalsy();
    expect(isTypeMatch([0, 1, 2, 3, 4, 5], 'record')).toBeFalsy();
    expect(isTypeMatch(new Map(), 'record')).toBeFalsy();

    class Hoge {
      hogeNum = 1;
      hogeStr = 'str';
      hogeBool = true;
      hogObj = new Object();
      hogeArr = [0, 1, 2];
    }
    const hoge = new Hoge();
    expect(isTypeMatch(hoge, 'record')).toBeFalsy();

    expect(hasField(hoge, 'hogeNum', 'number')).toBeTruthy();
    expect(hasField(hoge, 'hogeStr', 'string')).toBeTruthy();
    expect(hasField(hoge, 'hogeBool', 'boolean')).toBeTruthy();
    expect(hasField(hoge, 'hogObj', 'object')).toBeTruthy();
    expect(hasField(hoge, 'hogeArr', 'object')).toBeTruthy();
    expect(hasField(hoge, 'hogeArr', 'Array')).toBeTruthy();
    expect(isArrayType(hoge.hogeArr, 'number')).toBeTruthy();

    expect(hasField(hoge, 'hogeNum', 'Array')).toBeFalsy();
    expect(hasField(hoge, 'hogeArr', 'number')).toBeFalsy();
    expect(isArrayType(hoge.hogeArr, 'string')).toBeFalsy();
  });
  test('serialization', () => {
    const diary = container.resolve<IDiary>('IDiary');
    diary.getEntry(1).setContent(`1日目の記録`);
    diary.getEntry(1).setTitle(`1日目`);
    for (let i = 0; i < 5; i++) {
      const day = diary.createNewEntry();
      diary.getEntry(day).setContent(`${day}日目の記録`);
    }
    const json = JSON.stringify(diary);
    const compressJson = compressToEncodedURIComponent(json);
    expect(compressDiary(diary)).toBe(compressJson);
  });
  // 正常系のテストしかしていない。セーブデータを弄られることを想定していないため。
  test('deserialization v0', () => {
    const fileName = '/app/testFileV0.txt';
    deserialization(fileName);
  });
  // 正常系のテストしかしていない。セーブデータを弄られることを想定していないため。
  test('deserialization v1', () => {
    const fileName = '/app/testFileV1.txt';
    deserialization(fileName);
  });
  function deserialization(fileName: string) {
    const file = readFileSync(fileName).toString();
    const diaryDecompressor =
      container.resolve<IDiaryDecompressor>('IDiaryDecompressor');
    const diary = diaryDecompressor.decompressDiary(file);
    // セーブデータによらず最新のバージョンになる
    expect(diary.getSettings().version).toBe(1);
    // 正確に読み込めているかのテスト
    expect(diary.getSettings().storageKey).toBe(
      '726af4c3-30f9-4076-a42e-4645af041097'
    );
    expect(diary.getEntry(1).previous).toBe(undefined);
    for (let i = 1; i <= 5; i++) {
      expect(diary.getEntry(i).getTitle()).toBe(`${i}日目`);
      expect(diary.getEntry(i).getContent()).toBe(`test${i}`);
      expect(diary.getEntry(i).previous).toBe(i > 1 ? i - 1 : undefined);
      expect(diary.getEntry(i).next).toBe(i < 5 ? i + 1 : undefined);
    }
  }
});
