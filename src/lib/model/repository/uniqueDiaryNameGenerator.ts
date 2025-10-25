import { inject, injectable } from 'tsyringe';
import { IUniqueDiaryNameGenerator } from './diaryRepositoryInterfaces';
import type { IDiaryNameService } from '@/control/controlDiary/controlDiaryInterface';
@injectable()
export default class UniqueDiaryNameGenerator
  implements IUniqueDiaryNameGenerator
{
  constructor(
    @inject('IDiaryNameService') private diaryNameService: IDiaryNameService
  ) {}
  generate(name: string): string {
    // 日記名に重複がないか調べる。重複している場合は数字を付加して重複を避ける。
    let newName: string = name;
    let i: number = 1;
    while (this.diaryNameService.hasDiaryName(newName)) {
      newName = name + String(i);
      i++;
    }
    return newName;
  }
}
