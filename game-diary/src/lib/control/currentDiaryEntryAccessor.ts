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
    const lastDay = diary?.getLastDay();
    diary?.getEntry(lastDay);
  }
  getCurrentDiaryEntry(): IDiaryEntry {
    throw new Error('Method not implemented.');
  }
  setCurrentDiaryEntry(day: number): void {
    throw new Error('Method not implemented.');
  }
}
