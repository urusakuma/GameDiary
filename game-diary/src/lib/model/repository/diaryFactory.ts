import { inject, injectable } from 'tsyringe';
import { Diary } from '../diary/diary';
import type {
  IDiary,
  IDiaryEntry,
  NewDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '../diary/diaryModelInterfaces';
import type {
  IDiaryFactory,
  NewDiaryEntriesFactory,
} from './diaryRepositoryInterfaces';
@injectable()
export default class DiaryFactory implements IDiaryFactory {
  constructor(
    @inject('DiaryEntriesContainingFirstDayFactory')
    private newEntriesFactory: NewDiaryEntriesFactory,
    @inject('NewDiarySettingsFactory')
    private settingsFactory: NewDiarySettingsFactory,
    @inject('UsePreviousDayDiaryEntryFactory')
    private builder: UsePreviousDayDiaryEntryFactory
  ) {}
  create(diary?: IDiary): IDiary {
    const newEntries: Map<number, IDiaryEntry> = this.newEntriesFactory();
    if (diary === undefined) {
      const settings = this.settingsFactory();
      return new Diary(this.builder, newEntries, settings, 1);
    }
    const settings = this.settingsFactory(diary.getSettings());
    return new Diary(this.builder, newEntries, settings, 1);
  }
}
