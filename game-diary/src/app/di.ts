import { container } from 'tsyringe';
import {
  DiaryFactory,
  IDiaryEntry,
  IDiarySettings,
  UseExistingDataDiaryEntryFactory,
  UsePreviousDayDiaryEntryFactory,
} from './model/diary/diaryModelInterfaces';
import { DiaryEntry } from './model/diary/diaryEntry';
import { Diary } from './model/diary/diary';

container.register<UsePreviousDayDiaryEntryFactory>(
  'UsePreviousDayDiaryEntryFactory',
  {
    useFactory: () => (source: IDiaryEntry, settings: IDiarySettings) =>
      new DiaryEntry(
        settings.getNextDay(source.day),
        settings.getModifierDay(settings.getNextDay(source.day)),
        '',
        source.day,
        undefined
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
