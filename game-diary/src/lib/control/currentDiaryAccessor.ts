import { inject, injectable } from 'tsyringe';
import { IDiary } from '../model/diary/diaryModelInterfaces';
import { ICurrentDiaryAccessor } from './controlInterface';
import type {
  ICurrentDiaryManager,
  IDiaryService,
} from '../model/repository/diaryRepositoryInterfaces';

@injectable()
export class CurrentDiaryAccessor implements ICurrentDiaryAccessor {
  constructor(
    @inject('ICurrentDiaryManager')
    private currentDiaryManager: ICurrentDiaryManager,
    @inject('IDiaryService') private diaryService: IDiaryService
  ) {}

  getCurrentDiary(): IDiary | undefined {
    const key = this.currentDiaryManager.getCurrentDiaryKey();
    const diary = this.diaryService.getDiary(key);
    return diary;
  }
  setCurrentDiary(key: string): void {
    if (this.diaryService.getDiary(key) === undefined) {
      return;
    }
    this.currentDiaryManager.setCurrentDiaryKey(key);
  }
}
