import { inject, injectable } from 'tsyringe';

import type { IStorageService } from '@features/diary/services/persistence/storageServiceInterface';

import STORAGE_CONSTANTS from '../constants';
import { ICurrentDiaryManager } from './diaryPersistenceInterfaces';

@injectable()
export default class CurrentDiaryManager implements ICurrentDiaryManager {
  private currentDiaryKey: string = '';
  constructor(@inject('IStorageService') private storage: IStorageService) {}
  getCurrentDiaryKey(): string {
    // 空文字でなければキャッシュを返す
    if (this.currentDiaryKey !== '') {
      return this.currentDiaryKey;
    }
    // ストレージから取得してキャッシュに保存
    const key = this.storage.getItem(STORAGE_CONSTANTS.CURRENT_DIARY_KEY);
    if (key !== null) {
      this.currentDiaryKey = key;
    }
    return this.currentDiaryKey;
  }
  setCurrentDiaryKey(key: string): void {
    this.currentDiaryKey = key;
    this.storage.setItem(STORAGE_CONSTANTS.CURRENT_DIARY_KEY, key);
  }
}
