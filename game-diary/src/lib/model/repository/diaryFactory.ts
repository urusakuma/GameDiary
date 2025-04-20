import { container, inject, injectable } from 'tsyringe';
import Diary from '../diary/diary';
import type {
  IDiary,
  IDiaryEntry,
  IDiaryFactory,
  IDiarySettings,
  NewDiaryEntriesFactory,
  NewDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '../diary/diaryModelInterfaces';
@injectable()
export default class DiaryFactory implements IDiaryFactory {
  constructor(
    @inject('DIARY_ENTRIES_CONTAINING_FIRST_DAYFactory')
    private newEntriesFactory: NewDiaryEntriesFactory,
    @inject('NewDiarySettingsFactory')
    private settingsFactory: NewDiarySettingsFactory,
    @inject('UsePreviousDayDiaryEntryFactory')
    private builder: UsePreviousDayDiaryEntryFactory
  ) {}

  createUseExistingData(
    diaryEntries: Map<number, IDiaryEntry>,
    settings: IDiarySettings,
    lastDay: number
  ): IDiary {
    return new Diary(
      container.resolve('UseExistingDataDiaryEntryFactory'),
      diaryEntries,
      settings,
      lastDay
    );
  }
  createNewDiary(diary?: IDiary): IDiary {
    const newEntries: Map<number, IDiaryEntry> = this.newEntriesFactory();
    if (diary === undefined) {
      const settings = this.settingsFactory();
      return new Diary(this.builder, newEntries, settings, 1);
    }
    const settings = this.settingsFactory(diary.getSettings());
    return new Diary(this.builder, newEntries, settings, 1);
  }
}
