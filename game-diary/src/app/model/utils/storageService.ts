import { NotSupportedError } from '@/error';
import { IStorageService } from './storageServiceInterface';

export class LocalStorageService implements IStorageService {
  private storage = localStorage;
  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }
  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }
  get length() {
    return this.storage.length;
  }
}
/**
 * ストレージが使用できないときに例外を投げるための関数。
 * ストレージを使用する関数の置き換えに利用する。
 * @param _ 使用しない引数
 */
export const notSupportFunc = (..._: any[]) => {
  throw new NotSupportedError(
    'データが保存できませんでした。\nメモリが足りないか古いブラウザを使用しています。'
  );
};
/**
 * ストレージが使用可能か判別する。MDNからほぼ丸々コピってきたのでそのまま使えるはず。
 * @returns {boolean} ストレージが使用可能ならtrue、使用できないならfalse。
 */
export function isStorageAvailable(storage: IStorageService): boolean {
  try {
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.name === 'QuotaExceededError' || // everything except Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // Firefox
      storage &&
      storage.length !== 0 // acknowledge QuotaExceededError only if there's something already stored
    );
  }
}
