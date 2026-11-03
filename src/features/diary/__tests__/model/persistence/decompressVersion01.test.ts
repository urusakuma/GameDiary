import { decompressVersion01 } from '@features/diary/services/serialization/decompressVersion01';
import { InvalidJsonError } from '@lib/error';
import {
  changeField,
  createDecompressionFactories,
  createV1Data,
} from '../../__mocks__/decompressionFixtures';

describe('decompressVersion01', () => {
  let factories: ReturnType<typeof createDecompressionFactories>;
  beforeEach(() => {
    factories = createDecompressionFactories();
  });
  function decompress(data: object) {
    return decompressVersion01(
      data,
      factories.dayModifierFactory,
      factories.diarySettingsFactory,
      factories.diaryEntryFactory,
      factories.diaryFactory
    );
  }

  it('restores settings and reconstructs previous links from next links', () => {
    expect(decompress(createV1Data())).toBe(factories.diary);
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
      '現形式の日記',
      3,
      'current-key'
    );
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
    expect(factories.diaryFactory.createUseExistingData).toHaveBeenCalledWith(
      entries,
      factories.settings,
      4
    );
  });

  const fields: [string, unknown, string][] = [
    ['lastDay', '4', 'Reports class is broken'],
    ['settings', 'settings', 'Settings class is broken'],
    ['settings._storageKey', 1, 'Settings class is broken'],
    ['settings.diaryName', 1, 'Settings class is broken'],
    ['settings.dayInterval', '3', 'Settings class is broken'],
    ['settings._version', '1', 'Settings class is broken'],
    ['settings.dayModifier', 'modifier', 'Settings class is broken'],
    ['settings.dayModifier.modifier', 1, 'DayModifier class is broken'],
    ['settings.dayModifier.cycleLength', '15', 'DayModifier class is broken'],
    ['settings.dayModifier.unit', {}, 'DayModifier class is broken'],
    ['diaryEntries', {}, 'Array<DayReport> class is broken'],
    ['diaryEntries.0.day', '1', 'DayReport class is broken'],
    ['diaryEntries.0.title', 1, 'DayReport class is broken'],
    ['diaryEntries.0.content', 1, 'DayReport class is broken'],
  ];
  describe.each(fields)('required field %s', (path, wrongType, message) => {
    it.each([
      ['missing', undefined],
      ['null', null],
      ['wrong type', wrongType],
    ])('rejects %s', (_name, value) => {
      const data = createV1Data();
      changeField(data, path, value);
      expect(() => decompress(data)).toThrow(new InvalidJsonError(message));
      expect(
        factories.diaryFactory.createUseExistingData
      ).not.toHaveBeenCalled();
    });
  });

  it.each([{ unit: [] }, { unit: ['春'] }, { unit: ['春', '夏', '秋', '冬'] }])(
    'allows up to four modifier units: $unit',
    ({ unit }) => {
      const data = createV1Data();
      changeField(data, 'settings.dayModifier.unit', unit);
      decompress(data);
      expect(factories.dayModifierFactory).toHaveBeenCalledWith(
        '$Y年$C$D日',
        15,
        ...unit
      );
    }
  );

  it.each([{ unit: ['', '', '', '', ''] }, { unit: ['', 1] }])(
    'rejects invalid modifier units: $unit',
    ({ unit }) => {
      const data = createV1Data();
      changeField(data, 'settings.dayModifier.unit', unit);
      expect(() => decompress(data)).toThrow(
        new InvalidJsonError('DayModifier class is broken')
      );
    }
  );

  it.each([null, 'entry', 1, []].map((entry) => ({ entry })))(
    'rejects an invalid entry: $entry',
    ({ entry }) => {
      const data = createV1Data();
      changeField(data, 'diaryEntries', [entry]);
      expect(() => decompress(data)).toThrow(
        new InvalidJsonError('DayReport class is broken')
      );
    }
  );

  it.each([undefined, null, '4', false].map((next) => ({ next })))(
    'ignores an invalid next link: $next',
    ({ next }) => {
      const data = createV1Data();
      changeField(data, 'diaryEntries.0.next', next);
      decompress(data);
      expect(factories.diaryEntryFactory).toHaveBeenNthCalledWith(
        1,
        1,
        '開始',
        '最初の記録',
        undefined,
        undefined
      );
      expect(factories.diaryEntryFactory).toHaveBeenNthCalledWith(
        2,
        4,
        '続き',
        '次の記録',
        undefined,
        undefined
      );
    }
  );

  it('passes an empty entry map to the diary factory for recovery', () => {
    const data = createV1Data();
    changeField(data, 'diaryEntries', []);
    decompress(data);
    expect(factories.diaryEntryFactory).not.toHaveBeenCalled();
    expect(factories.diaryFactory.createUseExistingData).toHaveBeenCalledWith(
      new Map(),
      factories.settings,
      4
    );
  });
});
