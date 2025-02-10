import { DairySettingsConstant } from '@/dairySettingsConstant';
import { isArrayType, isTypeMatch } from '@/model/utils/checkTypeMatch';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import { inject, injectable } from 'tsyringe';
import { IDiaryKeyMapper } from './diaryControlInterfaces';
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
    // current_diary_keyがnullならcurrent_diary_keyを設定する
    if (storage.getItem(DairySettingsConstant.CURRENT_DIARY_KEY) === null) {
      this.setAnyDiaryKeyToCurrent();
    }
  }
  hasDiaryName(name: string): boolean {
    return this.names.has(name);
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
    const isCurrent = this.getCurrentDiaryKey() === key;
    this.diaryNameMap.delete(key);
    this.names.delete(removeName);
    this.saveDiaryNames();
    // カレントを削除した場合は他のDiaryをカレントに登録
    if (isCurrent) {
      this.setAnyDiaryKeyToCurrent();
    }
  }
  getCurrentDiaryKey(): string {
    const currentKey = this.storage.getItem(
      DairySettingsConstant.CURRENT_DIARY_KEY
    );
    if (currentKey === null) {
      // 通常操作ではありえないが、ストレージを直接操作した場合やバグなどであり得る
      try {
        this.setAnyDiaryKeyToCurrent();
      } finally {
        throw new KeyNotFoundError('not exist current_diary_key');
      }
    }
    return currentKey;
  }
  setCurrentDiaryKey(key: string): void {
    if (!this.diaryNameMap.has(key)) {
      throw new KeyNotFoundError(`not exist ${key}`);
    }
    this.storage.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, key);
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
  private setAnyDiaryKeyToCurrent() {
    /** なんでもいいからカレントのKeyを設定する*/
    const firstKey = this.diaryNameMap.keys().next().value;
    if (firstKey === undefined) {
      // 日記名が一つもない
      throw new RangeError('not exists any diary names');
    }
    this.setCurrentDiaryKey(firstKey);
  }
  private storeName(key: string, name: string) {
    /** ストレージキーと名前をこのクラスに保存する。*/
    // ゲームデータ名に重複がないか調べる。重複している場合は数字を付加して重複を避ける。
    let newName: string = name;
    let i: number = 1;
    while (this.names.has(newName)) {
      newName = name + String(i);
      i++;
    }
    this.diaryNameMap.set(key, newName);
    this.names.add(newName);
  }
}
