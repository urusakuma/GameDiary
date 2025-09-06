import { inject, injectable } from 'tsyringe';
import type {
  DiarySummary,
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

  create(name: string): DiarySummary {
    const oldDiary = this.diaryAccessor.getCurrentDiary();
    const newDiary = this.diaryFactory.createNewDiary(oldDiary, name);
    this.diaryService.addDiary(newDiary);
    const newName = newDiary.getSettings().getDiaryName();

    const key = newDiary.getSettings().storageKey;
    this.diaryAccessor.setCurrentDiary(key);
    return { key, name: newName };
  }
}
