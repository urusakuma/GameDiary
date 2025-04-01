import { inject, injectable } from 'tsyringe';
import type { ICurrentDiaryAccessor, IDiaryExporter } from './controlInterface';
import { DiaryExport } from '@/model/repository/diaryExport';
import { NotFoundError } from '@/error';

@injectable()
export default class DiaryExporter implements IDiaryExporter {
  constructor(
    @inject('IDiaryExporter') private diaryExport: DiaryExport,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  exportText(): string {
    const diary = this.diaryAccessor.getCurrentDiary();
    if (diary === undefined) {
      throw new NotFoundError('カレントの日記は見つかりませんでした');
    }
    return this.diaryExport.export(diary.getSettings().storageKey);
  }
  exportFile(): Blob {
    const diary = this.diaryAccessor.getCurrentDiary();
    if (diary === undefined) {
      throw new NotFoundError('カレントの日記は見つかりませんでした');
    }
    const exportStr = this.diaryExport.export(diary.getSettings().storageKey);
    return new Blob([exportStr]);
  }
}
