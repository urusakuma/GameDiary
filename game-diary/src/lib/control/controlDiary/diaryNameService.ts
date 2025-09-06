import type { IDiaryNameManager } from '@/model/repository/diaryRepositoryInterfaces';
import { IDiaryNameService } from './controlDiaryInterface';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiaryNameService implements IDiaryNameService {
  constructor(
    @inject('IDiaryNameManager') private diaryNameManager: IDiaryNameManager
  ) {}

  get length(): number {
    return this.diaryNameManager.length;
  }

  collectDiaryNameEntries(): Array<[string, string]> {
    return this.diaryNameManager.collectDiaryNameEntries();
  }
  getDiaryName(key: string): string {
    return this.diaryNameManager.getDiaryName(key);
  }
  updateDiaryName(key: string, name: string): boolean {
    return this.diaryNameManager.updateDiaryName(key, name);
  }

  removeDiaryName(key: string): void {
    this.diaryNameManager.removeDiaryName(key);
  }

  hasDiaryName(name: string): boolean {
    return this.diaryNameManager.hasDiaryName(name);
  }
}
