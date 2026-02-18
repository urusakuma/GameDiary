import { inject, injectable } from 'tsyringe';

import { KeyNotFoundError } from '@lib/error';
import type { IStorageService } from '@shared/utils/storageServiceInterface';
import type { IDiaryNameService } from '@features/diary/control/diary/controlDiaryInterface';
import type { IDiary } from '@features/diary/model/diaryModelInterfaces';
import type { IDiaryDecompressor } from '@features/diary/services/serialization/serializationInterface';
import type { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';

import type { IDiaryLoad } from './diaryPersistenceInterfaces';

@injectable()
export default class DiaryLoad implements IDiaryLoad {
  constructor(
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IStorageService') private storage: IStorageService,
    @inject('IDiaryDecompressor') private diaryDecompressor: IDiaryDecompressor,
    @inject('IDiaryNameService') private diaryNameService: IDiaryNameService
  ) {}
  load(key: string): IDiary {
    const diary = this.diaryService.getDiary(key);
    if (diary !== undefined) {
      return diary;
    }
    const diaryStr = this.storage.getItem(key);
    if (diaryStr === null) {
      throw new KeyNotFoundError(`Key "${key}" not found`);
    }
    const decompressedDiary = this.diaryDecompressor.decompressDiary(diaryStr);
    const uniqueName = this.diaryNameService.updateDiaryName(
      decompressedDiary.getSettings().storageKey,
      decompressedDiary.getSettings().getDiaryName()
    );
    decompressedDiary.getSettings().setDiaryName(uniqueName);
    this.diaryService.addDiary(decompressedDiary);
    return decompressedDiary;
  }
}
