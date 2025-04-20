import { inject, injectable } from 'tsyringe';
import type {
  ICurrentDiaryAccessor,
  IDiaryExporter,
} from './controlDiaryInterface';
import DiaryExport from '@/model/repository/diaryExport';

@injectable()
export default class DiaryExporter implements IDiaryExporter {
  constructor(
    @inject('IDiaryExporter') private diaryExport: DiaryExport,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  exportText(): string {
    const diary = this.diaryAccessor.getCurrentDiary();
    return this.diaryExport.export(diary.getSettings().storageKey);
  }
  exportFile(): [Blob, string] {
    const diary = this.diaryAccessor.getCurrentDiary();
    const fileName = `${diary.getSettings().getDiaryName()}.txt`;
    const exportStr = this.diaryExport.export(diary.getSettings().storageKey);
    return [new Blob([exportStr], { type: 'text/plain' }), fileName];
  }
}
