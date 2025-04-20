import { inject, injectable } from 'tsyringe';
import { IDiary } from '@/model/diary/diaryModelInterfaces';
import { ICurrentDiaryAccessor } from './controlDiaryInterface';
import type {
  ICurrentDiaryManager,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';
import { NotFoundError } from '@/error';

@injectable()
export default class CurrentDiaryAccessor implements ICurrentDiaryAccessor {
  constructor(
    @inject('ICurrentDiaryManager')
    private currentDiaryManager: ICurrentDiaryManager,
    @inject('IDiaryService') private diaryService: IDiaryService
  ) {}

  getCurrentDiary(): IDiary {
    const key = this.currentDiaryManager.getCurrentDiaryKey();
    const diary = this.diaryService.getDiary(key);
    if (diary === undefined) {
      throw new NotFoundError('current diary is not found');
    }
    return diary;
  }
  setCurrentDiary(key: string): void {
    if (this.diaryService.getDiary(key) === undefined) {
      return;
    }
    this.currentDiaryManager.setCurrentDiaryKey(key);
  }
}
