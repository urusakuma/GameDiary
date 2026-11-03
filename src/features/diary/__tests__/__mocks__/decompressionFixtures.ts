import DiaryEntry from '@features/diary/model/diaryEntry';
import type {
  IDiaryFactory,
  IDiarySettingsFactory,
  UseExistingDataDayModifierFactory,
  UseExistingDataDiaryEntryFactory,
} from '@features/diary/model/diaryModelInterfaces';
import { MockDayModifier } from './mockDayModifier';
import { MockDiary } from './mockDiary';
import { MockDiarySettings } from './mockDiarySettings';

export function createV0Data() {
  return {
    lastDay: 4,
    settings: {
      storageKey: 'legacy-key',
      playGamedataName: '旧形式の日記',
      dayInterval: 3,
      unitOfDay: {
        unit: ['$Y年$C$D日', '春', '夏', '秋', '冬'],
        CycleInUnitChanges: 15,
      },
    },
    dayReports: [
      [1, { day: 1, reportTitle: '開始', report: '最初の記録', next: 4 }],
      [4, { day: 4, reportTitle: '続き', report: '次の記録', previous: 1 }],
    ],
  };
}

export function createV1Data() {
  return {
    lastDay: 4,
    settings: {
      _storageKey: 'current-key',
      diaryName: '現形式の日記',
      dayInterval: 3,
      _version: 1,
      dayModifier: {
        modifier: '$Y年$C$D日',
        cycleLength: 15,
        unit: ['春', '夏', '秋', '冬'],
      },
    },
    diaryEntries: [
      { day: 1, title: '開始', content: '最初の記録', next: 4 },
      { day: 4, title: '続き', content: '次の記録' },
    ],
  };
}

export function createDecompressionFactories() {
  const dayModifier = new MockDayModifier();
  const settings = new MockDiarySettings();
  const diary = new MockDiary();
  const dayModifierFactory = jest
    .fn<
      ReturnType<UseExistingDataDayModifierFactory>,
      Parameters<UseExistingDataDayModifierFactory>
    >()
    .mockReturnValue(dayModifier);
  const diaryEntryFactory = jest.fn<
    ReturnType<UseExistingDataDiaryEntryFactory>,
    Parameters<UseExistingDataDiaryEntryFactory>
  >(
    (day, title, content, previous, next) =>
      new DiaryEntry(day, title, content, previous, next)
  );
  const diarySettingsFactory: jest.Mocked<IDiarySettingsFactory> = {
    createUseExistingData: jest.fn().mockReturnValue(settings),
    createNewDiarySettings: jest.fn(),
  };
  const diaryFactory: jest.Mocked<IDiaryFactory> = {
    createUseExistingData: jest.fn().mockReturnValue(diary),
    createNewDiary: jest.fn(),
  };
  return {
    dayModifier,
    settings,
    diary,
    dayModifierFactory,
    diarySettingsFactory,
    diaryEntryFactory,
    diaryFactory,
  };
}

// JSONのネストした必須フィールドを壊し、各検証分岐を独立して確認する。
export function changeField(data: object, path: string, value: unknown) {
  const keys = path.split('.');
  const field = keys.pop()!;
  let parent = data as Record<string, unknown>;
  for (const key of keys) {
    parent = parent[key] as Record<string, unknown>;
  }
  if (value === undefined) {
    delete parent[field];
  } else {
    parent[field] = value;
  }
}
