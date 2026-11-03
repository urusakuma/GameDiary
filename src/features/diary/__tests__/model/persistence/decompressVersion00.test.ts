import DiaryEntry from '@features/diary/model/diaryEntry';
import { decompressVersion00 } from '@features/diary/services/serialization/decompressVersion00';
import { InvalidJsonError } from '@lib/error';
import {
  changeField,
  createDecompressionFactories,
  createV0Data,
} from '../../__mocks__/decompressionFixtures';

describe('decompressVersion00', () => {
  let factories: ReturnType<typeof createDecompressionFactories>;
  beforeEach(() => {
    factories = createDecompressionFactories();
  });

  function decompress(data: object) {
    return decompressVersion00(
      data,
      factories.dayModifierFactory,
      factories.diarySettingsFactory,
      factories.diaryEntryFactory,
      factories.diaryFactory
    );
  }

  it('converts legacy settings and report tuples into the factory result', () => {
    const result = decompress(createV0Data());

    expect(result).toBe(factories.diary);
    expect(factories.dayModifierFactory).toHaveBeenCalledTimes(1);
    expect(factories.dayModifierFactory).toHaveBeenCalledWith(
      '$Y年$C$D日',
      15,
      '春',
      '夏',
      '秋',
      '冬'
    );
    expect(
      factories.diarySettingsFactory.createUseExistingData
    ).toHaveBeenCalledWith(
      factories.dayModifier,
      '旧形式の日記',
      3,
      'legacy-key'
    );
    expect(factories.diaryEntryFactory).toHaveBeenCalledTimes(2);
    expect(factories.diaryEntryFactory).toHaveBeenNthCalledWith(
      1,
      1,
      '開始',
      '最初の記録',
      undefined,
      4
    );
    expect(factories.diaryEntryFactory).toHaveBeenNthCalledWith(
      2,
      4,
      '続き',
      '次の記録',
      1,
      undefined
    );
    const entries =
      factories.diaryFactory.createUseExistingData.mock.calls[0][0];
    expect(Array.from(entries.keys())).toEqual([1, 4]);
    expect(entries.get(1)).toBe(
      factories.diaryEntryFactory.mock.results[0].value
    );
    expect(entries.get(4)).toBe(
      factories.diaryEntryFactory.mock.results[1].value
    );
    expect(factories.diaryFactory.createUseExistingData).toHaveBeenCalledWith(
      entries,
      factories.settings,
      4
    );
  });

  const requiredFields: [string, unknown, string][] = [
    ['lastDay', '4', 'Diary class is broken'],
    ['settings', 'settings', 'Settings class is broken'],
    ['settings.storageKey', 1, 'Settings class is broken'],
    ['settings.playGamedataName', 1, 'Settings class is broken'],
    ['settings.dayInterval', '3', 'Settings class is broken'],
    ['settings.unitOfDay', 'unit', 'Settings class is broken'],
    ['settings.unitOfDay.unit', {}, 'Settings class is broken'],
    ['settings.unitOfDay.CycleInUnitChanges', '15', 'Settings class is broken'],
    ['dayReports', {}, 'Array<DayReport> class is broken'],
    ['dayReports.0.1.day', '1', 'DayReport class is broken'],
    ['dayReports.0.1.reportTitle', 1, 'DayReport class is broken'],
    ['dayReports.0.1.report', 1, 'DayReport class is broken'],
  ];

  describe.each(requiredFields)(
    'required field %s',
    (path, wrongType, message) => {
      it.each([
        ['missing', undefined],
        ['null', null],
        ['wrong type', wrongType],
      ])('rejects %s', (_name, value) => {
        const data = createV0Data();
        changeField(data, path, value);
        expect(() => decompress(data)).toThrow(new InvalidJsonError(message));
        expect(
          factories.diaryFactory.createUseExistingData
        ).not.toHaveBeenCalled();
      });
    }
  );

  it.each(
    [
      [],
      ['日目'],
      ['日目', '', '', ''],
      ['日目', '', '', '', '', ''],
      ['日目', '', 1, '', ''],
    ].map((unit) => ({ unit }))
  )('rejects invalid modifier units: $unit', ({ unit }) => {
    const data = createV0Data();
    changeField(data, 'settings.unitOfDay.unit', unit);
    expect(() => decompress(data)).toThrow(
      new InvalidJsonError('Settings class is broken')
    );
  });

  it.each(
    [null, {}, 'report', [], [1], [1, null], [1, 'report'], [1, []]].map(
      (element) => ({ element })
    )
  )('rejects malformed report tuples: $element', ({ element }) => {
    const data = createV0Data();
    changeField(data, 'dayReports', [element]);
    expect(() => decompress(data)).toThrow(
      new InvalidJsonError('DayReport class is broken')
    );
    expect(factories.diaryFactory.createUseExistingData).not.toHaveBeenCalled();
  });

  it.each(['previous', 'next'])(
    'uses undefined for an absent or invalid %s link',
    (field) => {
      for (const value of [undefined, null, '4', {}, false]) {
        factories.diaryEntryFactory.mockClear();
        const data = createV0Data();
        changeField(data, 'dayReports.0.1.' + field, value);
        decompress(data);
        expect(
          factories.diaryEntryFactory.mock.calls[0][
            field === 'previous' ? 3 : 4
          ]
        ).toBeUndefined();
      }
    }
  );

  it('passes numeric links through to the entry factory', () => {
    const data = createV0Data();
    changeField(data, 'dayReports.0.1.previous', 0);
    changeField(data, 'dayReports.0.1.next', 4);
    decompress(data);
    expect(factories.diaryEntryFactory).toHaveBeenNthCalledWith(
      1,
      1,
      '開始',
      '最初の記録',
      0,
      4
    );
  });

  it('keys the map by the created entry day rather than the legacy tuple key', () => {
    const entry = new DiaryEntry(2, '補正済み', '', undefined, undefined);
    factories.diaryEntryFactory.mockReturnValueOnce(entry);
    const data = createV0Data();
    changeField(data, 'dayReports.0.0', 999);
    decompress(data);
    expect(
      factories.diaryFactory.createUseExistingData.mock.calls[0][0].get(2)
    ).toBe(entry);
  });

  it('passes empty reports to the diary factory for recovery', () => {
    const data = createV0Data();
    changeField(data, 'dayReports', []);
    decompress(data);
    expect(factories.diaryEntryFactory).not.toHaveBeenCalled();
    expect(factories.diaryFactory.createUseExistingData).toHaveBeenCalledWith(
      new Map(),
      factories.settings,
      4
    );
  });

  it('keeps the last entry when created days are duplicated', () => {
    const data = createV0Data();
    changeField(data, 'dayReports.1.1.day', 1);
    decompress(data);
    const entries =
      factories.diaryFactory.createUseExistingData.mock.calls[0][0];
    expect(entries.size).toBe(1);
    expect(entries.get(1)?.getContent()).toBe('次の記録');
  });

  it('propagates factory failures', () => {
    const failure = new Error('factory failure');
    factories.diaryEntryFactory.mockImplementation(() => {
      throw failure;
    });
    expect(() => decompress(createV0Data())).toThrow(failure);
    expect(factories.diaryFactory.createUseExistingData).not.toHaveBeenCalled();
  });
});
