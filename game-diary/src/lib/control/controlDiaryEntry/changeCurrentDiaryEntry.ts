import type {
  IChangeCurrentDiaryEntry,
  ICurrentDiaryEntryAccessor,
} from './controlDiaryEntryInterface';
import { inject, injectable } from 'tsyringe';
import type { ICurrentDiaryAccessor } from '../controlDiary/controlDiaryInterface';
@injectable()
export default class ChangeCurrentDiaryEntry
  implements IChangeCurrentDiaryEntry
{
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor,
    @inject('ICurrentDiaryEntryAccessor')
    private diaryEntryAccessor: ICurrentDiaryEntryAccessor
  ) {}
  moveByDate(date: number): void {
    this.diaryEntryAccessor.setCurrentDiaryEntry(date);
  }
  moveToNext(): void {
    const today = this.diaryEntryAccessor.getCurrentDiaryEntry();
    if (today.next !== undefined) {
      this.diaryEntryAccessor.setCurrentDiaryEntry(today.next);
      return;
    }
    const newDay = this.diaryAccessor.getCurrentDiary().createNewEntry();
    this.diaryEntryAccessor.setCurrentDiaryEntry(newDay);
  }
  moveToPrevious(): void {
    const today = this.diaryEntryAccessor.getCurrentDiaryEntry();
    if (today.previous === undefined) {
      return;
    }
    this.diaryEntryAccessor.setCurrentDiaryEntry(today.previous);
    const settings = this.diaryAccessor.getCurrentDiary().getSettings();
    if (today.isEdited(settings) || today.next !== undefined) {
      return;
    }
    this.diaryAccessor.getCurrentDiary().deleteEntry(today.day);
  }
}
