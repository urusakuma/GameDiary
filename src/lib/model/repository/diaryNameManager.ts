import DairySettingsConstant from '@/dairySettingsConstant';
import { isTypeMatch } from '@/model/utils/checkTypeMatch';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import { inject, injectable } from 'tsyringe';
import { IDiaryNameManager } from './diaryRepositoryInterfaces';
import { InvalidJsonError } from '@/error';
@injectable()
export default class DiaryNameManager implements IDiaryNameManager {
  private diaryNameSet: Set<string> = new Set<string>();
  private diaryNames: Record<string, string> = {};

  constructor(@inject('IStorageService') private storage: IStorageService) {
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
    const oldName = this.diaryNames[key];
    //ストレージキーと名前を保存してストレージに登録する
    this.diaryNames[key] = name;
    const result = this.storage.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify(this.diaryNames)
    );
    if (!result) {
      // ストレージの登録に失敗した場合、変更を元に戻す
      this.diaryNames[key] = oldName;
      return false;
    }
    // setの更新
    this.diaryNameSet.delete(oldName);
    this.diaryNameSet.add(name);
    return result;
  }

  removeDiaryName(key: string): void {
    const removeName = this.diaryNames[key];
    if (removeName === undefined) {
      return;
    }
    this.diaryNameSet.delete(removeName);
    delete this.diaryNames[key];
    this.storage.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify(this.diaryNames)
    );
  }
  hasDiaryName(name: string): boolean {
    return this.diaryNameSet.has(name);
  }
}
