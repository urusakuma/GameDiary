import { inject, injectable } from 'tsyringe';

import type { IDiaryNameService } from '@features/diary/control/diary/controlDiaryInterface';

import type { IDiaryDecompressor } from '@features/diary/services/serialization/serializationInterface';
import type { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';

import { IDiaryImport } from './diaryPersistenceInterfaces';

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
    const uniqueName = this.diaryNameService.updateDiaryName(
      diary.getSettings().storageKey,
      diary.getSettings().getDiaryName()
    );
    diary.getSettings().setDiaryName(uniqueName);
    return diary.getSettings().storageKey;
  }
}
