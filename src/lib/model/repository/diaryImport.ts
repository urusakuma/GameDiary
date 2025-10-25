import type { IDiaryNameService } from '@/control/controlDiary/controlDiaryInterface';
import type { IDiaryDecompressor } from '../serialization/serializationInterface';
import type { IDiaryImport, IDiaryService } from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiaryImport implements IDiaryImport {
  constructor(
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('IDiaryDecompressor') private diaryDecompressor: IDiaryDecompressor,
    @inject('IDiaryNameService') private diaryNameService: IDiaryNameService
  ) {}
  import(val: string): string {
    const diary = this.diaryDecompressor.decompressDiary(val);
    this.diaryService.addDiary(diary);
    this.diaryNameService.updateDiaryName(
      diary.getSettings().storageKey,
      diary.getSettings().getDiaryName()
    );
    return diary.getSettings().storageKey;
  }
}
