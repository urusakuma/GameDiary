import { IDiaryEntry } from '@/model/diary/diaryModelInterfaces';
import type { ICurrentDiaryAccessor } from '../controlDiary/controlDiaryInterface';
import type { ICurrentDiaryEntryAccessor } from './controlDiaryEntryInterface';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class CurrentDiaryEntryAccessor
  implements ICurrentDiaryEntryAccessor
{
  private entry: IDiaryEntry | undefined;
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  getCurrentDiaryEntry(): IDiaryEntry {
    if (this.entry === undefined) {
      const diary = this.diaryAccessor.getCurrentDiary();
      const lastDay = diary.getLastDay();
      this.entry = diary.getEntry(lastDay);
    }
    return this.entry;
  }
  setCurrentDiaryEntry(day: number): void {
    const diary = this.diaryAccessor.getCurrentDiary();
    this.entry = diary.getEntry(day);
  }
}
