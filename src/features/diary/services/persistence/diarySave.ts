import { inject, injectable } from 'tsyringe';

import { IDiary } from '@features/diary/model/diaryModelInterfaces';
import type { CompressDiary } from '@features/diary/services/serialization/serializationInterface';
import type { IStorageService } from '@features/diary/services/persistence/storageServiceInterface';

import type { IDiarySave } from './diaryPersistenceInterfaces';

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
