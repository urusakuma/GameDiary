import { IDiaryEntry } from '@/model/diary/diaryModelInterfaces';
import type {
  ICurrentDiaryAccessor,
  ICurrentDiaryEntryAccessor,
} from './controlInterface';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class CurrentDiaryEntryAccessor
  implements ICurrentDiaryEntryAccessor
{
  private entry: IDiaryEntry;
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {
    const diary = this.diaryAccessor.getCurrentDiary();
    const lastDay = diary.getLastDay();
    this.entry = diary.getEntry(lastDay);
  }
  getCurrentDiaryEntry(): IDiaryEntry {
    return this.entry;
  }
  setCurrentDiaryEntry(day: number): void {
    const diary = this.diaryAccessor.getCurrentDiary();
    this.entry = diary.getEntry(day);
  }
}
