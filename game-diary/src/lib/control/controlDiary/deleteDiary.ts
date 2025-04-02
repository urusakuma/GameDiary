import { inject, injectable } from 'tsyringe';
import { IDeleteDiary } from './controlDiaryInterface';
import type { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import { CurrentDiaryManager } from '@/model/repository/currentDiaryManager';
@injectable()
export class DeleteDiary implements IDeleteDiary {
  constructor(
    @inject('CurrentDiaryManager')
    private currentDiaryManager: CurrentDiaryManager,
    @inject('IDiaryService') private diaryService: IDiaryService
  ) {}

  delete(key: string): boolean {
    const currentKey = this.currentDiaryManager.getCurrentDiaryKey();
    if (currentKey === key) {
      return false;
    }
    this.diaryService.deleteDiary(key);
    return true;
  }
}
