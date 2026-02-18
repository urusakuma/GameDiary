import { inject, injectable } from 'tsyringe';

import type { ICurrentDiaryManager } from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import type { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';

import type { IDeleteDiary, IDiaryNameService } from '../controlDiaryInterface';

@injectable()
export default class DeleteDiary implements IDeleteDiary {
  constructor(
    @inject('ICurrentDiaryManager')
    private currentDiaryManager: ICurrentDiaryManager,
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IDiaryNameService') private diaryNameService: IDiaryNameService
  ) {}

  delete(key: string): boolean {
    const currentKey = this.currentDiaryManager.getCurrentDiaryKey();
    if (currentKey === key) {
      return false;
    }
    this.diaryService.deleteDiary(key);
    this.diaryNameService.removeDiaryName(key);
    return true;
  }
}
