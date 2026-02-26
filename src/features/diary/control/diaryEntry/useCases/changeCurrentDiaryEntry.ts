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

  moveByDate(day: number): void {
    this.diaryEntryAccessor.setCurrentDiaryEntry(day);
    this.diaryAccessor.getCurrentDiary().pruneTrailingUneditedEntries(day);
  }

  moveToNext(): void {
    const currentDiary = this.diaryAccessor.getCurrentDiary();

    const today = this.diaryEntryAccessor.getCurrentDiaryEntry().day;
    let nextEntry = currentDiary.getNextEntry(today)?.day;
    if (nextEntry === undefined) {
      nextEntry = currentDiary.createNewEntry();
    }

    this.diaryEntryAccessor.setCurrentDiaryEntry(nextEntry);
  }

  moveToPrevious(): void {
    const currentDiary = this.diaryAccessor.getCurrentDiary();

    const today = this.diaryEntryAccessor.getCurrentDiaryEntry().day;
    const previousDay = currentDiary.getPreviousEntry(today).day;

    this.diaryEntryAccessor.setCurrentDiaryEntry(previousDay);

    currentDiary.pruneTrailingUneditedEntries(previousDay);
  }
}
