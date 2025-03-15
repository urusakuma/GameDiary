import { QuotaExceededError } from '@/error';
import { IStorageService } from '@/model/utils/storageServiceInterface';

export class MockUnavailableStorageService implements IStorageService {
  getItem(key: string): string | null {
    throw new QuotaExceededError('Method not implemented.');
  }
  setItem(key: string, value: string): void {
    throw new QuotaExceededError('Method not implemented.');
  }
  removeItem(key: string): void {
    throw new QuotaExceededError('Method not implemented.');
  }
  get length() {
    return 0;
  }
}
