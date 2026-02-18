import { inject, injectable } from 'tsyringe';

import type { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';

import type {
  IChangeCurrentDiaryEntry,
  ICurrentDiaryEntryAccessor,
} from '../controlDiaryEntryInterface';

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

  moveToNext(): boolean {
    const today = this.diaryEntryAccessor.getCurrentDiaryEntry();
    if (today.next !== undefined) {
      this.diaryEntryAccessor.setCurrentDiaryEntry(today.next);
      return false;
    }
    // nextが存在しない場合新しくエントリを作成する。
    const newDay = this.diaryAccessor.getCurrentDiary().createNewEntry();
    this.diaryEntryAccessor.setCurrentDiaryEntry(newDay);
    return true;
  }

  moveToPrevious(): boolean {
    const today = this.diaryEntryAccessor.getCurrentDiaryEntry();
    if (today.previous === undefined) {
      // previousが存在しない場合は移動できない。
      return false;
    }
    this.diaryEntryAccessor.setCurrentDiaryEntry(today.previous);
    const settings = this.diaryAccessor.getCurrentDiary().getSettings();
    if (today.isEdited(settings) || today.next !== undefined) {
      // 編集済み、またはnextが存在する場合は削除しない。
      return false;
    }
    this.diaryAccessor.getCurrentDiary().deleteEntry(today.day);
    return true;
  }
}
