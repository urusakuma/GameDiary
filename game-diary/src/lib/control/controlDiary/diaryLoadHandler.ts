import type { IDiaryLoad } from '@/model/repository/diaryRepositoryInterfaces';
import type {
  IDiaryLoadHandler,
  ICurrentDiaryAccessor,
} from './controlDiaryInterface';
import { inject, injectable } from 'tsyringe';
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
