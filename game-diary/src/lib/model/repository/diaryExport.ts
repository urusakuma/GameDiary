import type { CompressDiary } from '../serialization/serializationInterface';
import type { IDiaryExport, IDiaryService } from './diaryRepositoryInterfaces';
import { inject, injectable } from 'tsyringe';
@injectable()
export class DiaryExport implements IDiaryExport {
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
