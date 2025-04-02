import { inject } from 'tsyringe';
import type {
  ICurrentDiaryAccessor,
  IDiarySaveHandler,
} from './controlDiaryInterface';
import type { IDiarySave } from '@/model/repository/diaryRepositoryInterfaces';

export default class DiarySaveHandler implements IDiarySaveHandler {
  constructor(
    @inject('IDiarySave') private diarySave: IDiarySave,
    @inject('IDiarySave') private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  save(): void {
    const diary = this.diaryAccessor.getCurrentDiary();
    this.diarySave.save(diary);
  }
}
