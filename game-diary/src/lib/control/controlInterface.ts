import { IDiaryEntry } from '../model/diary/diaryModelInterfaces';

export interface ISelectDiary {
  byDate: (date: number) => IDiaryEntry;
  byNext: () => IDiaryEntry;
  byPrevious: () => IDiaryEntry;
}
