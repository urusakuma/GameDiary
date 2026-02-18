import { IStorageService } from '@shared/utils/storageServiceInterface';
import { injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export class MockStorageService implements IStorageService {
  private storage = new Map<string, string>();
  constructor() {}
  isStorageAvailable(): boolean {
    return true;
  }

  getItem(key: string): string | null {
    const item = this.storage.get(key);
    return item ?? null;
  }
  setItem(key: string, value: string): boolean {
    this.storage.set(key, value);
    return true;
  }
  removeItem(key: string): void {
    this.storage.delete(key);
  }
  get length() {
    return this.storage.size;
  }
}
