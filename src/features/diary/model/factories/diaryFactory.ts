import { inject, injectable } from 'tsyringe';
import Diary from '../diary';
import type {
  IDiary,
  IDiaryEntry,
  IDiaryFactory,
  IDiarySettings,
  IDiarySettingsFactory,
  NewDiaryEntriesFactory,
  UsePreviousDayDiaryEntryFactory,
} from '../diaryModelInterfaces';
@injectable()
export default class DiaryFactory implements IDiaryFactory {
  constructor(
    @inject('NewDiaryEntriesFactory')
    private newEntriesFactory: NewDiaryEntriesFactory,
    @inject('IDiarySettingsFactory')
    private settingsFactory: IDiarySettingsFactory,
    @inject('UsePreviousDayDiaryEntryFactory')
    private factory: UsePreviousDayDiaryEntryFactory
  ) {}

  createUseExistingData(
    diaryEntries: Map<number, IDiaryEntry>,
    settings: IDiarySettings,
    lastDay: number
  ): IDiary {
    lastDay = Math.trunc(lastDay);
    if (lastDay < 1 || diaryEntries.get(lastDay) === undefined) {
      lastDay = 1;
    }
    if (diaryEntries.size === 0) {
      diaryEntries = this.newEntriesFactory();
    }
    return new Diary(this.factory, diaryEntries, settings, lastDay);
  }
  createNewDiary(diary?: IDiary, name?: string): IDiary {
    const newEntries: Map<number, IDiaryEntry> = this.newEntriesFactory();
    const settings = this.settingsFactory.createNewDiarySettings(
      diary?.getSettings(),
      name
    );
    return new Diary(this.factory, newEntries, settings, 1);
  }
}
