import { inject, injectable } from 'tsyringe';

import type { IDiaryExport } from '@features/diary/services/persistence/diaryPersistenceInterfaces';

import type {
  ExportFile,
  ICurrentDiaryAccessor,
  IDiaryExporter,
} from '../controlDiaryInterface';

@injectable()
export default class DiaryExporter implements IDiaryExporter {
  constructor(
    @inject('IDiaryExport') private diaryExport: IDiaryExport,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}

  exportText(): string {
    const diary = this.diaryAccessor.getCurrentDiary();
    return this.diaryExport.export(diary.getSettings().storageKey);
  }

  async exportFile(): Promise<ExportFile> {
    const diary = this.diaryAccessor.getCurrentDiary();
    const fileName = `${diary.getSettings().getDiaryName()}.txt`;
    const exportStr = this.diaryExport.export(diary.getSettings().storageKey);
    const data = new Blob([exportStr], { type: 'text/plain' });
    return { data, fileName };
  }
}
