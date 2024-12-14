import { container } from 'tsyringe';
import {
  DiaryFactory,
  IDiaryEntry,
  IDiarySettings,
  UseExistingDataDiaryEntryFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { DiaryEntry } from '@/model/diary/diaryEntry';
import { Diary } from '@/model/diary/diary';
import { Constant } from '@/constant';

container.register<string>('GAME_DATA_NAME', {
  useValue: Constant.DEFAULT_GAME_DATA_NAME,
});
container.register<number>('DAY_INTERVAL', {
  useValue: Constant.DEFAULT_DAY_INTERVAL,
});
container.register<string>('STORAGE_KEY', {
<<<<<<< HEAD
useValue: crypto.randomUUID(), //TODO:useFactoryに変更する。そうしないと値をキャッシュしてしまう。

=======
  useValue: crypto.randomUUID(), //TODO:useFactoryに変更する。そうしないと値をキャッシュしてしまう。
>>>>>>> origin/create_report
});
container.register<number>('VERSION', {
  useValue: Constant.CURRENT_VERSION,
});
container.register<number>('CYCLE_LENGTH', {
  useValue: Constant.DEFAULT_CYCLE_LENGTH,
});
container.register<string>('DAY_MODIFIER', {
  useValue: Constant.DEFAULT_DAY_MODIFIER,
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
    useFactory: () => (source: IDiaryEntry, settings: IDiarySettings) =>
      new DiaryEntry(
        settings.getNextDay(source.day), // TODO: getNextDay(source.day)を変数にする
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
