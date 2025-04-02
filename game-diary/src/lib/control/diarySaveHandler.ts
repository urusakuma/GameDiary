import { inject } from 'tsyringe';
import type {
  ICurrentDiaryAccessor,
  IDiarySaveHandler,
} from './controlInterface';
import type { IDiarySave } from '@/model/repository/diaryRepositoryInterfaces';

export default class DiarySaveHandler implements IDiarySaveHandler {
  constructor(
    @inject('IDiarySave') private diarySave: IDiarySave,
    @inject('IDiarySave') private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  save(): void {
    const diary = this.diaryAccessor.getCurrentDiary();
    if (diary === undefined) {
      return;
    }
    this.diarySave.save(diary);
  }
}
