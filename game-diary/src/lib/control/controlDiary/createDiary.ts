import { inject, injectable } from 'tsyringe';
import type {
  DiarySummary,
  ICreateDiary,
  ICurrentDiaryAccessor,
  IDiaryNameService,
} from './controlDiaryInterface';
import type { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import type { IDiary, IDiaryFactory } from '@/model/diary/diaryModelInterfaces';
@injectable()
export default class CreateDiary implements ICreateDiary {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor,
    @inject('IDiaryFactory')
    private diaryFactory: IDiaryFactory,
    @inject('IDiaryService')
    private diaryService: IDiaryService,
    @inject('IDiaryNameService')
    private diaryNameService: IDiaryNameService
  ) {}

  create(name: string): DiarySummary {
    const oldDiary = this.diaryAccessor.getCurrentDiary();
    const newDiary = this.diaryFactory.createNewDiary(oldDiary, name);
    const { key, name: newName } = this.finalizeDiary(newDiary);

    return { key, name: newName };
  }
  createDefaultDiary(): DiarySummary {
    const newDiary = this.diaryFactory.createNewDiary();
    const { key, name: newName } = this.finalizeDiary(newDiary);
    return { key, name: newName };
  }
  /**日記を生成したあとに行う共通処理
   * diaryServiceに渡し、名前を登録して、カレントにし、DiarySummaryを返却する
   */
  private finalizeDiary(newDiary: IDiary): DiarySummary {
    this.diaryService.addDiary(newDiary);
    const newName = newDiary.getSettings().getDiaryName();
    const key = newDiary.getSettings().storageKey;
    this.diaryNameService.updateDiaryName(key, newName);
    this.diaryAccessor.setCurrentDiary(key);
    return { key, name: newName };
  }
}
