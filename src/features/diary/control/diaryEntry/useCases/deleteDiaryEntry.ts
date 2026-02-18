import { inject,injectable } from 'tsyringe';

import type { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';

import { IDeleteDiaryEntry } from '../controlDiaryEntryInterface';

@injectable()
export default class DeleteDiaryEntry implements IDeleteDiaryEntry {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  
  delete(day: number): void {
    this.diaryAccessor.getCurrentDiary().deleteEntry(day);
  }
}
