import type { IDiaryDecompressor } from '../serialization/serializationInterface';
import type {
  IDiaryImport,
  IDiaryNameManager,
  IDiaryService,
} from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiaryImport implements IDiaryImport {
  constructor(
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IDiaryDecompressor') private diaryDecompressor: IDiaryDecompressor,
    @inject('IDiaryNameManager') private diaryNameManager: IDiaryNameManager
  ) {}
  import(val: string): string {
    const diary = this.diaryDecompressor.decompressDiary(val);
    this.diaryService.addDiary(diary);
    this.diaryNameManager.updateDiaryName(
      diary.getSettings().storageKey,
      diary.getSettings().getDiaryName()
    );
    return diary.getSettings().storageKey;
  }
}
