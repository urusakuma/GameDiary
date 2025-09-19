import { inject, injectable } from 'tsyringe';
import type { IDiary } from '@/model/diary/diaryModelInterfaces';
import { ICurrentDiaryAccessor } from './controlDiaryInterface';
import type {
  ICurrentDiaryManager,
  IDiaryLoad,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';

@injectable()
export default class CurrentDiaryAccessor implements ICurrentDiaryAccessor {
  constructor(
    @inject('ICurrentDiaryManager')
    private currentDiaryManager: ICurrentDiaryManager,
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IDiaryLoad') private diaryLoad: IDiaryLoad
  ) {}

  getCurrentDiary(): IDiary {
    const key = this.currentDiaryManager.getCurrentDiaryKey();
    const diary = this.diaryService.getDiary(key);
    if (diary === undefined) {
      return this.diaryLoad.load(key);
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
