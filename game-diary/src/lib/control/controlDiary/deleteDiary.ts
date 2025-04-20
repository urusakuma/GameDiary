import { inject, injectable } from 'tsyringe';
import { IDeleteDiary } from './controlDiaryInterface';
import type {
  ICurrentDiaryManager,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';
@injectable()
export default class DeleteDiary implements IDeleteDiary {
  constructor(
    @inject('CurrentDiaryManager')
    private currentDiaryManager: ICurrentDiaryManager,
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
