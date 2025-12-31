import { inject, injectable } from 'tsyringe';
import type { IStorageService } from '../utils/storageServiceInterface';
import { ICurrentDiaryManager } from './diaryRepositoryInterfaces';
import DairySettingsConstant from '@/dairySettingsConstant';
@injectable()
export default class CurrentDiaryManager implements ICurrentDiaryManager {
  private currentDiaryKey: string = '';
  constructor(@inject('IStorageService') private storage: IStorageService) {
    this.currentDiaryKey = this.getCurrentDiaryKey();
  }
  getCurrentDiaryKey(): string {
    if (this.currentDiaryKey === '') {
      const key = this.storage.getItem(DairySettingsConstant.CURRENT_DIARY_KEY);
      if (key !== null) {
        this.currentDiaryKey = key;
      }
    }
    return this.currentDiaryKey;
  }
  setCurrentDiaryKey(key: string): void {
    this.currentDiaryKey = key;
    this.storage.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, key);
  }
}
