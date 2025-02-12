import { DairySettingsConstant } from '@/dairySettingsConstant';
import { isArrayType, isTypeMatch } from '@/model/utils/checkTypeMatch';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import { inject, injectable } from 'tsyringe';
import { IDiaryKeyMapper } from './diaryRepositoryInterfaces';
import { InvalidJsonError, KeyNotFoundError } from '@/error';
import {
  isStorageAvailable,
  notSupportFunc,
} from '@/model/utils/storageService';
@injectable()
export class DiaryKeyMapper implements IDiaryKeyMapper {
  /** ストレージキーと名前の連想配列。ストレージキーがkey、ゲームデータ名がval。 */
  private diaryNameMap: Map<string, string> = new Map<string, string>();
  /** 名前が重複しないために名前を保存しておく集合 */
  private names: Set<string> = new Set<string>();
  constructor(
    @inject('IStorageService')
    private storage: IStorageService
  ) {
    if (!isStorageAvailable(storage)) {
      // すべてのpublic関数を使用不可にする。
      this.updateDiaryName = notSupportFunc;
      this.getCurrentDiaryKey = notSupportFunc;
      this.setCurrentDiaryKey = notSupportFunc;
      this.collectDiaryNames = notSupportFunc;
      this.removeDiaryName = notSupportFunc;
      return;
    }
    // まず、itemListを初期化し、ストレージからゲームデータ名のリストを取得する。
    const listStr = storage.getItem(DairySettingsConstant.DIARY_NAME_LIST);
    if (listStr === null) {
      // nullならデータが存在しない
      return;
    }
    // 取得したJSONをゲームデータ名のリストに変換できるか確認
    const diaryNameListJson: unknown = JSON.parse(listStr);
    if (!isTypeMatch(diaryNameListJson, 'Array')) {
      throw new InvalidJsonError('diary_name_list is broken');
    }
    // ゲームデータ名をMapとSetに保存
    diaryNameListJson
      .filter((v) => isTypeMatch(v, 'Array') && isArrayType(v, 'string'))
      .forEach((v) => {
        // ゲームデータ名をMapとSetに保存
        this.storeName(v[0], v[1]);
      });
  }
  get length(): number {
    return this.diaryNameMap.size;
  }
  collectDiaryNames(): Array<string> {
    return this.names.values().toArray();
  }

  updateDiaryName(key: string, name: string): boolean {
    // keyかnameが空文字なら変更不可
    if (key === '' || name === '') {
      return false;
    }
    // 既に存在するストレージキーならnamesから名前を削除しておく
    const oldName = this.diaryNameMap.get(key);
    if (oldName !== undefined) {
      this.names.delete(oldName);
    }
    //ストレージキーと名前を保存してストレージに登録する
    this.storeName(key, name);
    this.saveDiaryNames();
    return true;
  }

  removeDiaryName(key: string): void {
    const removeName = this.diaryNameMap.get(key);
    if (removeName === undefined) {
      return;
    }
    // MapとSetから削除してセーブ
    this.diaryNameMap.delete(key);
    this.names.delete(removeName);
    this.saveDiaryNames();
  }
  getCurrentDiaryKey(): string | null {
    const currentKey = this.storage.getItem(
      DairySettingsConstant.CURRENT_DIARY_KEY
    );
    return currentKey;
  }
  setCurrentDiaryKey(key: string): void {
    if (!this.diaryNameMap.has(key)) {
      throw new KeyNotFoundError(`not exist ${key}`);
    }
    this.storage.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, key);
  }
  hasDiaryName(name: string): boolean {
    return this.names.has(name);
  }
  private saveDiaryNames() {
    /** ストレージキーと名前を紐づけてストレージに保存*/
    const itemList: Array<[string, string]> = [];
    this.diaryNameMap.entries().map((v) => itemList.push([v[0], v[1]]));
    this.storage.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify(itemList)
    );
  }
  private storeName(key: string, name: string) {
    /** ストレージキーと名前をこのクラスに保存する。*/
    this.diaryNameMap.set(key, name);
    this.names.add(name);
  }
}
