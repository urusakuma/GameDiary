import { inject, injectable } from 'tsyringe';

import type { IDiaryLoad } from '@features/diary/services/persistence/diaryPersistenceInterfaces';

import type {
  IDiaryLoadHandler,
  ICurrentDiaryAccessor,
} from '../controlDiaryInterface';

@injectable()
export default class DiaryLoadHandler implements IDiaryLoadHandler {
  constructor(
    @inject('IDiaryLoad') private diaryLoad: IDiaryLoad,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}

  load(key: string): void {
    const diary = this.diaryAccessor.getCurrentDiary();
    if (diary.getSettings().storageKey === key) {
      return;
    }
    this.diaryLoad.load(key);
    this.diaryAccessor.setCurrentDiary(key);
  }
}
