import DairySettingsConstant from '@/dairySettingsConstant';
import { isTypeMatch } from '@/model/utils/checkTypeMatch';
import type {
  IsStorageAvailableFunc,
  IStorageService,
} from '@/model/utils/storageServiceInterface';
import { inject, injectable } from 'tsyringe';
import { IDiaryNameManager } from './diaryRepositoryInterfaces';
import { InvalidJsonError } from '@/error';
@injectable()
export default class DiaryNameManager implements IDiaryNameManager {
  private diaryNameSet: Set<string> = new Set<string>();
  private diaryNames: Record<string, string> = {};

  constructor(
    @inject('IStorageService')
    private storage: IStorageService,
    @inject('IsStorageAvailableFunc')
    private isStorageAvailable: IsStorageAvailableFunc
  ) {
    // まず、itemListを初期化し、ストレージからゲームデータ名のリストを取得する。
    const recordStr = storage.getItem(DairySettingsConstant.DIARY_NAME_LIST);
    if (recordStr === null) {
      // nullならデータが存在しない
      return;
    }
    // 取得したJSONをゲームデータ名のリストに変換できるか確認
    const diaryNameRecordJson: unknown = JSON.parse(recordStr);
    if (!isTypeMatch(diaryNameRecordJson, 'record')) {
      throw new InvalidJsonError('diary_name_list is broken');
    }
    Object.entries(diaryNameRecordJson)
      .filter(
        (v): v is [string, string] =>
          isTypeMatch(v[0], 'string') && isTypeMatch(v[1], 'string')
      )
      .forEach((v) => {
        this.diaryNames[v[0]] = v[1];
        this.diaryNameSet.add(v[1]);
      });
  }
  get length(): number {
    return this.diaryNameSet.size;
  }
  collectDiaryNameEntries(): Array<[string, string]> {
    return Object.entries(this.diaryNames);
  }
  getDiaryName(key: string): string {
    return this.diaryNames[key];
  }

  updateDiaryName(key: string, name: string): boolean {
    // keyかnameが空文字、もしくはすでに存在する名前なら変更不可
    if (key === '' || name === '' || this.diaryNameSet.has(name)) {
      return false;
    }
    //前の文字をsetから取り除く
    this.diaryNameSet.delete(this.diaryNames[key]);
    //ストレージキーと名前を保存してストレージに登録する
    this.diaryNameSet.add(name);
    this.diaryNames[key] = name;
    if (this.isStorageAvailable(this.storage)) {
      this.storage.setItem(
        DairySettingsConstant.DIARY_NAME_LIST,
        JSON.stringify(this.diaryNames)
      );
    }
    return true;
  }

  removeDiaryName(key: string): void {
    const removeName = this.diaryNames[key];
    if (removeName === undefined) {
      return;
    }
    this.diaryNameSet.delete(removeName);
    delete this.diaryNames[key];
    if (this.isStorageAvailable(this.storage)) {
      this.storage.setItem(
        DairySettingsConstant.DIARY_NAME_LIST,
        JSON.stringify(this.diaryNames)
      );
    }
  }
  hasDiaryName(name: string): boolean {
    return this.diaryNameSet.has(name);
  }
}
