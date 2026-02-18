import { inject, injectable } from 'tsyringe';

import type { IDiarySave } from '@features/diary/services/persistence/diaryPersistenceInterfaces';

import type {
  ICurrentDiaryAccessor,
  IDiarySaveHandler,
} from '../controlDiaryInterface';

@injectable()
export default class DiarySaveHandler implements IDiarySaveHandler {
  constructor(
    @inject('IDiarySave') private diarySave: IDiarySave,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}

  save(): boolean {
    const diary = this.diaryAccessor.getCurrentDiary();
    return this.diarySave.save(diary);
  }
}
