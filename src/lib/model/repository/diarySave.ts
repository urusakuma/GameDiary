import { IDiary } from '../diary/diaryModelInterfaces';
import type { CompressDiary } from '../serialization/serializationInterface';
import type { IStorageService } from '../utils/storageServiceInterface';
import { IDiarySave } from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiarySave implements IDiarySave {
  constructor(
    @inject('IStorageService') private storage: IStorageService,
    @inject('CompressDiary') private compressDiary: CompressDiary
  ) {}
  save(diary: IDiary): boolean {
    return this.storage.setItem(
      diary.getSettings().storageKey,
      this.compressDiary(diary)
    );
  }
}
