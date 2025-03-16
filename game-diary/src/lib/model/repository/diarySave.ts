import { UnusedStorageError } from 'src/lib/error';
import { IDiary } from '../diary/diaryModelInterfaces';
import type { CompressDiary } from '../serialization/serializationInterface';
import type {
  IsStorageAvailableFunc,
  IStorageService,
} from '../utils/storageServiceInterface';
import { IDiarySave } from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export class DiarySave implements IDiarySave {
  constructor(
    @inject('IStorageService') private storage: IStorageService,
    @inject('CompressDiary') private compressDiary: CompressDiary,
    @inject('IsStorageAvailableFunc')
    private isStorageAvailable: IsStorageAvailableFunc
  ) {}
  save(diary: IDiary): void {
    if (!this.isStorageAvailable(this.storage)) {
      throw new UnusedStorageError('can not you use the storage');
    }
    this.storage.setItem(
      diary.getSettings().storageKey,
      this.compressDiary(diary)
    );
  }
}
