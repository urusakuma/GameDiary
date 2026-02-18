import { inject, injectable } from 'tsyringe';

import type { CompressDiary } from '@features/diary/services/serialization/serializationInterface';
import type { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';

import { IDiaryExport } from './diaryPersistenceInterfaces';

@injectable()
export default class DiaryExport implements IDiaryExport {
  constructor(
    @inject('IDiaryService') private diaryService: IDiaryService,
    @inject('CompressDiary') private compressDiary: CompressDiary
  ) {}
  export(key: string): string {
    const diary = this.diaryService.getDiary(key);
    if (diary === undefined) {
      return '';
    }
    return this.compressDiary(diary);
  }
}
