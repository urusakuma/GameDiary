import { inject, injectable } from 'tsyringe';
import type {
  ICreateDiary,
  ICurrentDiaryAccessor,
} from './controlDiaryInterface';
import type {
  IDiaryFactory,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';
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
    const newDiary = this.diaryFactory.create(oldDiary);
    this.diaryService.addDiary(newDiary);
    this.diaryAccessor.setCurrentDiary(newDiary.getSettings().storageKey);
  }
}
