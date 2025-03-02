import { inject, injectable, singleton } from 'tsyringe';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
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
    private storage: IStorageService
  ) {}
  getDiary(key: string): IDiary | undefined {
    return this.diaries.get(key);
  }
  addDiary(diary: IDiary): void {
    this.diaries.set(diary.getSettings().storageKey, diary);
    this.storage.setItem(diary.getSettings().storageKey, JSON.stringify(diary));
  }
  deleteDiary(key: string): void {
    this.diaries.delete(key);
    this.storage.removeItem(key);
  }
}
