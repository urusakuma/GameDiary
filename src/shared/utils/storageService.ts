import { IStorageService } from './storageServiceInterface';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class StorageService implements IStorageService {
  constructor(@inject('LocalStorage') private storage: Storage) {}
  private _isStorageAvailable: boolean | null = null;
  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  setItem(key: string, value: string): boolean {
    if (
      this._isStorageAvailable === false ||
      this._isStorageAvailable === null
    ) {
      // まだ確認していない、もしくは使用不可と判定されている場合は確認する
      // 再確認するため、キャッシュをnullに設定する
      this._isStorageAvailable = null;
      const isAvailable = this.isStorageAvailable();
      if (!isAvailable) {
        // ストレージが使用不可なので保存しない
        return false;
      }
    }
    try {
      this.storage.setItem(key, value);
      return true;
    } catch (e) {
      // 何らかの理由により保存に失敗した
      // 入力が大きすぎるだけかもしれないのでisStorageAvailableで使用可否を再確認する
      // 再確認するため、キャッシュをnullに設定する
      this._isStorageAvailable = null;
      this.isStorageAvailable();
      return false;
    }
  }
  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (e) {
      return;
    }
  }

  /**
   * ストレージが使用可能か判別する。原因は問わず、使用不可の場合はfalseを返す。
   * @returns {boolean} ストレージが使用可能ならtrue、使用できないならfalse。
   */
  isStorageAvailable(): boolean {
    if (this._isStorageAvailable === null) {
      // まだ確認していない場合は確認する
      try {
        const x = '__storage_test__';
        this.storage.setItem(x, x);
        this.storage.removeItem(x);
        this._isStorageAvailable = true;
      } catch (e) {
        this._isStorageAvailable =
          e instanceof DOMException &&
          (e.name === 'QuotaExceededError' || // Firefox以外のブラウザ
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED'); // Firefox
      }
    }
    return this._isStorageAvailable;
  }

  get length() {
    return this.storage.length;
  }
}
