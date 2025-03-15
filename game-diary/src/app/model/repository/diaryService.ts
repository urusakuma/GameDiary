import { inject, injectable, singleton } from 'tsyringe';
import type {
  IsStorageAvailableFunc,
  IStorageService,
} from '@/model/utils/storageServiceInterface';
import type { IDiary } from '@/model/diary/diaryModelInterfaces';
import type { IDiaryService } from './diaryRepositoryInterfaces';
/**
 * 全ての日記を管理するクラス。
 */
@singleton()
@injectable()
export class DiaryService implements IDiaryService {
  private diaries: Map<string, IDiary> = new Map();
  constructor(
    @inject('IStorageService')
    private storage: IStorageService,
    @inject('IsStorageAvailableFunc')
    private isStorageAvailable: IsStorageAvailableFunc
  ) {}
  getDiary(key: string): IDiary | undefined {
    return this.diaries.get(key);
  }
  addDiary(diary: IDiary): void {
    this.diaries.set(diary.getSettings().storageKey, diary);
    if (this.isStorageAvailable(this.storage)) {
      this.storage.setItem(
        diary.getSettings().storageKey,
        JSON.stringify(diary)
      );
    }
  }
  deleteDiary(key: string): void {
    this.diaries.delete(key);
    this.storage.removeItem(key);
  }
}
