import { inject, injectable } from 'tsyringe';
import type { IStorageService } from '../utils/storageServiceInterface';
import { IDiaryDelete } from './diaryRepositoryInterfaces';
@injectable()
export default class DiaryDelete implements IDiaryDelete {
  constructor(@inject('IStorageService') private storage: IStorageService) {}
  delete(key: string): void {
    this.storage.removeItem(key);
  }
}
