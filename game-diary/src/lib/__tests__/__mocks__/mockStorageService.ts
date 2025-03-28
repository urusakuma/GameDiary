import { IStorageService } from 'src/lib/model/utils/storageServiceInterface';
import { injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export class MockStorageService implements IStorageService {
  private storage = new Map<string, string>();
  constructor() {}

  getItem(key: string): string | null {
    const item = this.storage.get(key);
    return item ?? null;
  }
  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
  removeItem(key: string): void {
    this.storage.delete(key);
  }
  get length() {
    return this.storage.size;
  }
}
