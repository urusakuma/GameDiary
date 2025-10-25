import { inject, injectable } from 'tsyringe';
import Diary from '../diary/diary';
import type {
  IDiary,
  IDiaryEntry,
  IDiaryFactory,
  IDiarySettings,
  IDiarySettingsFactory,
  NewDiaryEntriesFactory,
  UsePreviousDayDiaryEntryFactory,
} from '../diary/diaryModelInterfaces';
@injectable()
export default class DiaryFactory implements IDiaryFactory {
  constructor(
    @inject('NewDiaryEntriesFactory')
    private newEntriesFactory: NewDiaryEntriesFactory,
    @inject('IDiarySettingsFactory')
    private settingsFactory: IDiarySettingsFactory,
    @inject('UsePreviousDayDiaryEntryFactory')
    private builder: UsePreviousDayDiaryEntryFactory
  ) {}

  createUseExistingData(
    diaryEntries: Map<number, IDiaryEntry>,
    settings: IDiarySettings,
    lastDay: number
  ): IDiary {
    return new Diary(this.builder, diaryEntries, settings, lastDay);
  }
  createNewDiary(diary?: IDiary, name?: string): IDiary {
    const newEntries: Map<number, IDiaryEntry> = this.newEntriesFactory();
    const settings = this.settingsFactory.createNewDiarySettings(
      diary?.getSettings(),
      name
    );
    return new Diary(this.builder, newEntries, settings, 1);
  }
}
