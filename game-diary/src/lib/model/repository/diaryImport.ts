import type { IDiaryDecompressor } from '../serialization/serializationInterface';
import type { IDiaryImport, IDiaryService } from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiaryImport implements IDiaryImport {
  constructor(
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IDiaryDecompressor') private diaryDecompressor: IDiaryDecompressor
  ) {}
  import(val: string): string {
    const diary = this.diaryDecompressor.decompressDiary(val);
    this.diaryService.addDiary(diary);
    return diary.getSettings().storageKey;
  }
}
