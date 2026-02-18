import { inject, injectable } from 'tsyringe';

import type { IDiary } from '@features/diary/model/diaryModelInterfaces';
import type {
  IDiaryLoad,
  ICurrentDiaryManager,
} from '@features/diary/services/persistence/diaryPersistenceInterfaces';

import { ICurrentDiaryAccessor } from '../controlDiaryInterface';

@injectable()
export default class CurrentDiaryAccessor implements ICurrentDiaryAccessor {
  constructor(
    @inject('ICurrentDiaryManager')
    private currentDiaryManager: ICurrentDiaryManager,
    @inject('IDiaryLoad') private diaryLoad: IDiaryLoad
  ) {}

  getCurrentDiary(): IDiary {
    const key = this.currentDiaryManager.getCurrentDiaryKey();
    const diary = this.diaryLoad.load(key);
    return diary;
  }
  setCurrentDiary(key: string): void {
    if (this.diaryLoad.load(key) === undefined) {
      return;
    }
    this.currentDiaryManager.setCurrentDiaryKey(key);
  }
}
