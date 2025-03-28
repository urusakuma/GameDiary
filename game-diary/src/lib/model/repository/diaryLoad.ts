import { KeyNotFoundError } from 'src/lib/error';
import { IDiary } from '../diary/diaryModelInterfaces';
import type { IDiaryDecompressor } from '../serialization/serializationInterface';
import type { IStorageService } from '../utils/storageServiceInterface';
import type { IDiaryLoad, IDiaryService } from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export class DiaryLoad implements IDiaryLoad {
  constructor(
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IStorageService') private storage: IStorageService,
    @inject('IDiaryDecompressor') private diaryDecompressor: IDiaryDecompressor
  ) {}
  load(key: string): IDiary {
    const diary = this.diaryService.getDiary(key);
    if (diary !== undefined) {
      return diary;
    }
    const diaryStr = this.storage.getItem(key);
    if (diaryStr === null) {
      throw new KeyNotFoundError(`Key ${key} not found`);
    }
    const decompressedDiary = this.diaryDecompressor.decompressDiary(diaryStr);
    this.diaryService.addDiary(decompressedDiary);
    return decompressedDiary;
  }
}
