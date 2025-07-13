import { inject, injectable } from 'tsyringe';
import type {
  ICurrentDiaryAccessor,
  IDiarySaveHandler,
} from './controlDiaryInterface';
import type { IDiarySave } from '@/model/repository/diaryRepositoryInterfaces';
@injectable()
export default class DiarySaveHandler implements IDiarySaveHandler {
  constructor(
    @inject('IDiarySave') private diarySave: IDiarySave,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  save(): void {
    const diary = this.diaryAccessor.getCurrentDiary();
    this.diarySave.save(diary);
  }
}
