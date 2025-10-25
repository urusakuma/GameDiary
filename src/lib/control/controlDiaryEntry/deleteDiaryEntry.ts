import { inject } from 'tsyringe';
import type { ICurrentDiaryAccessor } from '../controlDiary/controlDiaryInterface';
import { IDeleteDiaryEntry } from './controlDiaryEntryInterface';

export default class DeleteDiaryEntry implements IDeleteDiaryEntry {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  delete(day: number): void {
    this.diaryAccessor.getCurrentDiary().deleteEntry(day);
  }
}
