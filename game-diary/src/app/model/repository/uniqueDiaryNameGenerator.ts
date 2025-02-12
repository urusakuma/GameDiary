import { inject } from 'tsyringe';
import type {
  IDiaryKeyMapper,
  IUniqueDiaryNameGenerator,
} from './diaryControlInterfaces';

export class UniqueDiaryNameGenerator implements IUniqueDiaryNameGenerator {
  constructor(
    @inject('IDiaryKeyMapper') private diaryKeyMapper: IDiaryKeyMapper
  ) {}
  ensureUniqueName(name: string): string {
    // 日記名に重複がないか調べる。重複している場合は数字を付加して重複を避ける。
    let newName: string = name;
    let i: number = 1;
    while (this.diaryKeyMapper.hasDiaryName(newName)) {
      newName = name + String(i);
      i++;
    }
    return newName;
  }
}
