import { inject, injectable } from 'tsyringe';
import type {
  ICreateDiary,
  ICurrentDiaryAccessor,
} from './controlDiaryInterface';
import type { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import type { IDiaryFactory } from '@/model/diary/diaryModelInterfaces';
@injectable()
export default class CreateDiary implements ICreateDiary {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor,
    @inject('IDiaryFactory')
    private diaryFactory: IDiaryFactory,
    @inject('IDiaryService')
    private diaryService: IDiaryService
  ) {}

  create(): void {
    const oldDiary = this.diaryAccessor.getCurrentDiary();
    const newDiary = this.diaryFactory.createNewDiary(oldDiary);
    this.diaryService.addDiary(newDiary);
    this.diaryAccessor.setCurrentDiary(newDiary.getSettings().storageKey);
  }
}
