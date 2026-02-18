import { inject, injectable } from 'tsyringe';

import type { IDiaryNameManager } from '../persistence/diaryPersistenceInterfaces';
import { IUniqueDiaryNameGenerator } from './diaryDomainServiceInterfaces';

@injectable()
export default class UniqueDiaryNameGenerator
  implements IUniqueDiaryNameGenerator
{
  constructor(
    @inject('IDiaryNameManager') private diaryNameManager: IDiaryNameManager
  ) {}

  generate(name: string, key?: string): string {
    // すでに登録されているkeyの場合、名前が同名であるならそのkeyが占有している名前であると判断する。
    if (key !== undefined && this.diaryNameManager.getDiaryName(key) === name) {
      return name;
    }
    // 日記名に重複がないか調べる。重複している場合は数字を付加して重複を避ける。
    let newName: string = name;
    let i: number = 1;
    while (this.diaryNameManager.hasDiaryName(newName)) {
      newName = name + String(i);
      i++;
      // 無限ループ防止
      if (i > 10000) {
        throw new Error('Unable to generate a unique diary name.');
      }
    }
    return newName;
  }
}
