import {
  IDiaryNameManager,
  IDiaryLoader,
} from '@/model/repository/diaryRepositoryInterfaces';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { container, Lifecycle } from 'tsyringe';
import { DiaryLoader } from '@/model/repository/diaryLoader';
import {
  DayModifierFactory,
  DiaryFactory,
  IDayModifier,
  IDiaryEntry,
  IDiarySettings,
  NewDiaryFactory,
  NewDiarySettingsFactory,
  UseExistingDataDiaryEntryFactory,
  UseExistingDataDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { Diary } from '@/model/diary/diary';
import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import { DiaryDecompressor } from '@/model/serialization/diarySerializer';
import { MockDiaryKeyMapper } from '../__mocks__/mockDiaryKeyMapper';
import { DayModifier } from '@/model/diary/dayModifier';
import { DiarySettings } from '@/model/diary/diarySettings';
import { DiaryEntry } from '@/model/diary/diaryEntry';
import { MockEnvironmentStorageService } from '../__mocks__/mockEnvironmentStorageService';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import { MockDayModifier } from '../__mocks__/mockDayModifier';

describe('DiaryLoader class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockEnvironmentStorageService
    );
    container.register<IDiaryNameManager>('IDiaryNameManager', {
      useClass: MockDiaryKeyMapper,
    });
    container.register<IDiaryDecompressor>('IDiaryDecompressor', {
      useClass: DiaryDecompressor,
    });
    container.register<DayModifierFactory>('DayModifierFactory', {
      useFactory:
        () =>
        (modifier: string, cycleLength: number, ...unit: Array<string>) =>
          new DayModifier(modifier, cycleLength, ...unit),
    });

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
    container.register<UseExistingDataDiarySettingsFactory>(
      'UseExistingDataDiarySettingsFactory',
      {
        useFactory:
          () =>
          (
            dayModifier: IDayModifier,
            diaryName: string,
            dayInterval: number,
            storageKey: string,
            version: number
          ) =>
            new DiarySettings(
              dayModifier,
              diaryName,
              dayInterval,
              storageKey,
              version
            ),
      }
    );
    container.register<IDiarySettings>('IDiarySettings', {
      useClass: DiarySettings,
    });
    container.register<NewDiarySettingsFactory>('NewDiarySettingsFactory', {
      useFactory:
        () =>
        (dayModifier: IDayModifier, DiaryName: string, dayInterval: number) =>
          new DiarySettings(
            dayModifier,
            DiaryName,
            dayInterval,
            container.resolve<string>('STORAGE_KEY'),
            container.resolve<number>('VERSION')
          ),
    });
    container.register<IDayModifier>('IDayModifier', {
      useClass: MockDayModifier,
    });
    container.register<NewDiaryFactory>('NewDiaryFactory', {
      useFactory: () => (settings?: IDiarySettings) => {
        let newSettings = null;
        if (settings !== undefined) {
          const newSettingsFactory = container.resolve<NewDiarySettingsFactory>(
            'NewDiarySettingsFactory'
          );
          const dayModifierFactory =
            container.resolve<DayModifierFactory>('DayModifierFactory');
          const newDayModifier = dayModifierFactory(
            settings.getModifier(),
            settings.getCycleLength(),
            settings.getModifierUnit(0),
            settings.getModifierUnit(1),
            settings.getModifierUnit(2),
            settings.getModifierUnit(3)
          );
          newSettings = newSettingsFactory(
            newDayModifier,
            DairySettingsConstant.DEFAULT_DIARY_NAME,
            settings.getDayInterval()
          );
        } else {
          newSettings = container.resolve<IDiarySettings>('IDiarySettings');
        }
        return new Diary(
          container.resolve<UsePreviousDayDiaryEntryFactory>(
            'UsePreviousDayDiaryEntryFactory'
          ),
          container.resolve<Map<number, IDiaryEntry>>(
            'DiaryEntriesContainingFirstDay'
          ),
          newSettings
        );
      },
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

    container.register<Map<number, IDiaryEntry>>(
      'DiaryEntriesContainingFirstDay',
      {
        useFactory: () =>
          new Map<number, IDiaryEntry>().set(
            1,
            container.resolve<UseExistingDataDiaryEntryFactory>(
              'UseExistingDataDiaryEntryFactory'
            )(1, '1日目', '', undefined, undefined)
          ),
      }
    );
    container.register<string>('DIARY_NAME', {
      useValue: DairySettingsConstant.DEFAULT_DIARY_NAME,
    });
    container.register<number>('DAY_INTERVAL', {
      useValue: DairySettingsConstant.DEFAULT_DAY_INTERVAL,
    });
    container.register<string>('STORAGE_KEY', {
      useFactory: () => crypto.randomUUID(),
    });
    container.register<number>('VERSION', {
      useValue: DairySettingsConstant.CURRENT_VERSION,
    });
    container.register<DiaryLoader>('IDiaryLoader', { useClass: DiaryLoader });
  });
  test('test createNewDiary no arguments', () => {
    const diaryLoader = container.resolve<IDiaryLoader>('IDiaryLoader');
    const diary1 = diaryLoader.createNewDiary();
    const firstDiaryKey = diary1.getSettings().storageKey;
    expect(diary1.getSettings().storageKey).toBeDefined();
    const diary2 = diaryLoader.createNewDiary();
    expect(diary2.getSettings().storageKey).not.toBe(firstDiaryKey);
  });

  test('test loadDiary with existing key', () => {
    const diaryLoader = container.resolve<IDiaryLoader>('IDiaryLoader');
    const diaryKey = '726af4c3-30f9-4076-a42e-4645af041097';
    const diaryData = {
      settings: {
        dayModifier: {
          modifier: '日目',
          cycleLength: 10,
          unit: [],
        },
        dayInterval: 1,
        diaryName: 'test',
        _storageKey: diaryKey,
        _version: 1,
      },
      diaryEntries: new Map<number, object>()
        .set(1, { day: 1, title: '1日目', content: 'test1', next: 2 })
        .set(2, { day: 2, title: '2日目', content: 'test2', next: 3 })
        .set(3, { day: 3, title: '3日目', content: 'test3', next: 4 })
        .set(4, { day: 4, title: '4日目', content: 'test4', next: 5 })
        .set(5, { day: 5, title: '5日目', content: 'test5' }),
      lastDay: 5,
    };
    const loadedDiary = diaryLoader.loadDiary(diaryKey);
    expect(loadedDiary).toMatchObject(diaryData);
  });

  test('test loadDiary with no key', () => {
    const diaryLoader = container.resolve<IDiaryLoader>('IDiaryLoader');
    const loadedDiary = diaryLoader.loadDiary();
    const diaryKey = '726af4c3-30f9-4076-a42e-4645af041097';
    expect(loadedDiary).toBeDefined();
    expect(loadedDiary.getSettings().storageKey).not.toBe(diaryKey);
    const diaryData = {
      settings: {
        dayModifier: {
          modifier: '日目',
          cycleLength: 10,
          unit: [],
        },
        dayInterval: 1,
        diaryName: DairySettingsConstant.DEFAULT_DIARY_NAME,
        _storageKey: diaryKey,
        _version: 1,
      },
      diaryEntries: new Map<number, object>().set(1, {
        day: 1,
        title: '1日目',
        content: '',
      }),
      lastDay: 1,
    };
    diaryData.settings._storageKey = loadedDiary.getSettings().storageKey;
    expect(loadedDiary).toMatchObject(diaryData);
    expect(loadedDiary.getSettings().storageKey).not.toBe(diaryKey);
  });
});
