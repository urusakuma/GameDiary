import { inject, injectable } from 'tsyringe';
import type {
  IsStorageAvailableFunc,
  IStorageService,
} from '../utils/storageServiceInterface';
import { ICurrentDiaryManager } from './diaryRepositoryInterfaces';
import DairySettingsConstant from '@/dairySettingsConstant';
@injectable()
export default class CurrentDiaryManager implements ICurrentDiaryManager {
  private currentDiaryKey: string = '';
  constructor(
    @inject('IStorageService') private storage: IStorageService,
    @inject('IsStorageAvailableFunc')
    private isStorageAvailable: IsStorageAvailableFunc
  ) {
    const key = this.storage.getItem(DairySettingsConstant.CURRENT_DIARY_KEY);
    if (key !== null) {
      this.currentDiaryKey = key;
      return;
    }
  }
  getCurrentDiaryKey(): string {
    return this.currentDiaryKey;
  }
  setCurrentDiaryKey(key: string): void {
    this.currentDiaryKey = key;
    if (!this.isStorageAvailable(this.storage)) {
      return;
    }
    this.storage.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, key);
  }
}
