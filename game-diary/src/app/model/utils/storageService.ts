import { IStorageService } from './storageServiceInterface';

export class LocalStorageService implements IStorageService {
  getItem = (key: string): string | null => {
    return localStorage.getItem(key);
  };
  setItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };
  removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };
  get length() {
    return localStorage.length;
  }
}
/**
 * ストレージが使用可能か判別する。MDNからほぼ丸々コピってきたのでそのまま使えるはず。
 * @returns {boolean} ローカルストレージが使用可能ならtrue、使用できないならfalse。
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
