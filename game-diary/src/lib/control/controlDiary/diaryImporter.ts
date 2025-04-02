import type { IDiaryImport } from '@/model/repository/diaryRepositoryInterfaces';
import type {
  ICurrentDiaryAccessor,
  IDiaryImporter,
} from './controlDiaryInterface';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiaryImporter implements IDiaryImporter {
  constructor(
    @inject('IDiaryImport') private diaryImport: IDiaryImport,
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  importText(val: string): string {
    const key = this.diaryImport.import(val);
    this.diaryAccessor.setCurrentDiary(key);
    return key;
  }
  async importFile(file: File): Promise<string> {
    const key = new Promise<string>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          const key = this.diaryImport.import(fileContent);
          this.diaryAccessor.setCurrentDiary(key);
          resolve(key);
        };
        reader.readAsText(file);
      } catch (e) {
        reject(e);
      }
    });
    return key;
  }
}
