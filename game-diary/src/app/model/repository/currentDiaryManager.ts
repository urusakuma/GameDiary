import { inject } from 'tsyringe';
import type { IStorageService } from '../utils/storageServiceInterface';
import { ICurrentDiaryManager } from './diaryRepositoryInterfaces';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import { isStorageAvailable } from '../utils/storageService';

export class CurrentDiaryManager implements ICurrentDiaryManager {
  private currentDiaryKey: string = '';
  constructor(@inject('IStorageService') private storage: IStorageService) {
    if (!isStorageAvailable(this.storage)) {
      return;
    }
    const key = this.storage.getItem(DairySettingsConstant.CURRENT_DIARY_KEY);
    if (key) {
      this.currentDiaryKey = key;
    }
  }
  getCurrentDiaryKey(): string {
    return this.currentDiaryKey;
  }
  setCurrentDiaryKey(key: string): void {
    this.currentDiaryKey = key;
    if (!isStorageAvailable(this.storage)) {
      return;
    }
    this.storage.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, key);
  }
}
