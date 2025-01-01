import { container } from 'tsyringe';
import {
  DayModifierFactory,
  DiaryFactory,
  IDayModifier,
  IDiary,
  IDiaryEntry,
  IDiarySettings,
  UseExistingDataDiaryEntryFactory,
  UseExistingDataDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { DiaryEntry } from '@/model/diary/diaryEntry';
import { Diary } from '@/model/diary/diary';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import { DayModifier } from '@/model/diary/dayModifier';
import { DiarySettings } from '@/model/diary/diarySettings';

container.register<string>('GAME_DATA_NAME', {
  useValue: DairySettingsConstant.DEFAULT_GAME_DATA_NAME,
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
container.register<number>('CYCLE_LENGTH', {
  useValue: DairySettingsConstant.DEFAULT_CYCLE_LENGTH,
});
container.register<string>('DAY_MODIFIER', {
  useValue: DairySettingsConstant.DEFAULT_DAY_MODIFIER,
});
container.register<string>('EMPTY_STRING', { useValue: '' });

container.register<Map<number, IDiaryEntry>>('DiaryEntriesContainingFirstDay', {
  useValue: new Map<number, IDiaryEntry>(),
});
container.register<number>('FirstDay', {
  useValue: 1,
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
container.register<DiaryFactory>('DiaryEntryFactory', {
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
        playGameDataName: string,
        dayInterval: number,
        storageKey: string,
        version: number
      ) =>
        new DiarySettings(
          dayModifier,
          playGameDataName,
          dayInterval,
          storageKey,
          version
        ),
  }
);
container.register<IDiary>('IDiary', { useClass: Diary });
