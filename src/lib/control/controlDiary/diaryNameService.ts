import type {
  IDiaryNameManager,
  IUniqueDiaryNameGenerator,
} from '@/model/repository/diaryRepositoryInterfaces';
import { IDiaryNameService } from './controlDiaryInterface';
import { inject, injectable } from 'tsyringe';
@injectable()
export default class DiaryNameService implements IDiaryNameService {
  constructor(
    @inject('IDiaryNameManager') private diaryNameManager: IDiaryNameManager,
    @inject('IUniqueDiaryNameGenerator')
    private nameGenerator: IUniqueDiaryNameGenerator
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
  addDiaryName(key: string, name: string): string {
    return this.updateDiaryName(key, name);
  }
  updateDiaryName(key: string, name: string): string {
    const uniqueName = this.nameGenerator.generate(name, key);
    this.diaryNameManager.updateDiaryName(key, uniqueName);
    return uniqueName;
  }

  removeDiaryName(key: string): void {
    this.diaryNameManager.removeDiaryName(key);
  }

  hasDiaryName(name: string): boolean {
    return this.diaryNameManager.hasDiaryName(name);
  }
}
