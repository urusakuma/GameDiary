import { inject, injectable } from 'tsyringe';

import type { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import type {
  IDiary,
  IDiaryFactory,
} from '@features/diary/model/diaryModelInterfaces';

import type {
  DiarySummary,
  ICreateDiary,
  ICurrentDiaryAccessor,
  IDiaryNameService,
} from '../controlDiaryInterface';

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
   * diaryServiceに渡し、タイトルを修正し、名前を登録して、カレントにし、DiarySummaryを返却する
   */
  private finalizeDiary(newDiary: IDiary): DiarySummary {
    // diaryServiceに登録する。
    this.diaryService.addDiary(newDiary);
    const newSettings = newDiary.getSettings();

    // タイトルをsettingsに基づいて修正する
    const lastDay = newDiary.getLastDay();
    const newEntryName = newSettings.getModifierDay(lastDay);
    newDiary.getEntry(lastDay).setTitle(newEntryName);

    // 名前を登録して、カレントに登録する
    const newDiaryName = newSettings.getDiaryName();
    const key = newSettings.storageKey;
    this.diaryNameService.updateDiaryName(key, newDiaryName);
    this.diaryAccessor.setCurrentDiary(key);
    return { key, name: newDiaryName };
  }
}
