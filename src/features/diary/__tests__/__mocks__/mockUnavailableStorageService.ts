import { QuotaExceededError } from '@lib/error';
import { IStorageService } from '@features/diary/services/persistence/storageServiceInterface';

export class MockUnavailableStorageService implements IStorageService {
  getItem(key: string): string | null {
    throw new QuotaExceededError(`Storage unavailable for ${key}`);
  }
  setItem(key: string, value: string): boolean {
    throw new QuotaExceededError(
      `Cannot store ${value.length} characters for ${key}`
    );
  }
  removeItem(key: string): void {
    throw new QuotaExceededError(`Storage unavailable for ${key}`);
  }
  isStorageAvailable(): boolean {
    return false;
  }
  get length() {
    return 0;
  }
}
