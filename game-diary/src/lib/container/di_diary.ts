import { container } from 'tsyringe';
import {
  DayModifierFactory,
  DiaryFactory,
  IDayModifier,
  IDiary,
  IDiaryEntry,
  IDiarySettings,
  NewDiaryFactory,
  NewDiarySettingsFactory,
  UseExistingDataDiaryEntryFactory,
  UseExistingDataDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { DiaryEntry } from '@/model/diary/diaryEntry';
import { Diary } from '@/model/diary/diary';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import { DayModifier } from '@/model/diary/dayModifier';
import { DiarySettings } from '@/model/diary/diarySettings';
import { IUniqueDiaryNameGenerator } from '@/model/repository/diaryRepositoryInterfaces';

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
container.register<number>('CYCLE_LENGTH', {
  useValue: DairySettingsConstant.DEFAULT_CYCLE_LENGTH,
});
container.register<string>('DAY_MODIFIER', {
  useValue: DairySettingsConstant.DEFAULT_DAY_MODIFIER,
});
container.register<string>('EMPTY_STRING', { useValue: '' });

container.register<Map<number, IDiaryEntry>>('DiaryEntriesContainingFirstDay', {
  useValue: new Map<number, IDiaryEntry>().set(
    1,
    container.resolve<UseExistingDataDiaryEntryFactory>(
      'UseExistingDataDiaryEntryFactory'
    )(1, '1日目', '', undefined, undefined)
  ),
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
container.register<DayModifierFactory>('DayModifierFactory', {
  useFactory:
    () =>
    (modifier: string, cycleLength: number, ...unit: Array<string>) =>
      new DayModifier(modifier, cycleLength, ...unit),
});
container.register<NewDiarySettingsFactory>('NewDiarySettingsFactory', {
  useFactory:
    () => (dayModifier: IDayModifier, diaryName: string, dayInterval: number) =>
      new DiarySettings(
        dayModifier,
        diaryName,
        dayInterval,
        container.resolve<string>('STORAGE_KEY'),
        container.resolve<number>('VERSION')
      ),
});
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
container.register<IDayModifier>('IDayModifier', {
  useClass: DayModifier,
});
container.register<IDiarySettings>('IDiarySettings', {
  useClass: DiarySettings,
});
container.register<IDiary>('IDiary', { useClass: Diary });

container.register<NewDiaryFactory>('NewDiaryFactory', {
  useFactory: () => (settings?: IDiarySettings) => {
    settings ??= container.resolve<IDiarySettings>('IDiarySettings');
    const nameGenerator = container.resolve<IUniqueDiaryNameGenerator>(
      'IUniqueDiaryNameGenerator'
    );
    const name = nameGenerator.generateUniqueName(settings.getDiaryName());
    settings.setDiaryName(name);
    return new Diary(
      container.resolve<UsePreviousDayDiaryEntryFactory>(
        'UsePreviousDayDiaryEntryFactory'
      ),
      container.resolve<Map<number, IDiaryEntry>>(
        'DiaryEntriesContainingFirstDay'
      ),
      settings
    );
  },
});
