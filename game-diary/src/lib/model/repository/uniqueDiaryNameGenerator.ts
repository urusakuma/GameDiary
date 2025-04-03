import { inject } from 'tsyringe';
import type {
  IDiaryNameManager,
  IUniqueDiaryNameGenerator,
} from './diaryRepositoryInterfaces';

export class UniqueDiaryNameGenerator implements IUniqueDiaryNameGenerator {
  constructor(
    @inject('IDiaryNameManager') private diaryKeyMapper: IDiaryNameManager
  ) {}
  generate(name: string): string {
    // 日記名に重複がないか調べる。重複している場合は数字を付加して重複を避ける。
    let newName: string = name;
    let i: number = 1;
    while (this.diaryKeyMapper.isIncludeDiaryName(newName)) {
      newName = name + String(i);
      i++;
    }
    return newName;
  }
}
