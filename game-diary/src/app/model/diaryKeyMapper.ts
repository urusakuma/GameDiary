import { Constant } from '@/constant';
import {
  hasField,
  isArrayType,
  isTypeMatch,
} from '@/model/utils/checkTypeMatch';
import type { IStorageService } from './utils/storageServiceInterface';
import { inject } from 'tsyringe';
import { IDiaryKeyMapper } from './diaryInterfaces';
import { InvalidJsonError, KeyNotFoundError } from '@/error';
import { isStorageAvailable, notSupportFunc } from './utils/storageService';

export class DiaryKeyMapper implements IDiaryKeyMapper {
  /** ストレージキーと名前の連想配列。ストレージキーがkey、ゲームデータ名がval。 */
  private itemMap: Map<string, string> = new Map<string, string>();
  /** 名前が重複しないために名前を保存しておく集合 */
  private names: Set<string> = new Set<string>();
  constructor(
    @inject('StorageService')
    private storage: IStorageService
  ) {
    if (!isStorageAvailable(storage)) {
      this.setGameDataName = notSupportFunc;
      this.getCurrentGameDataKey = notSupportFunc;
      this.setCurrentGameDataKey = notSupportFunc;
    }
    // まず、itemListを初期化し、ストレージからゲームデータ名のリストを取得する。
    const list = storage.getItem(Constant.GAME_DATA_NAME_LIST);
    if (list === null) {
      return;
    }
    // 取得したJSONをゲームデータ名のリストに変換できるか確認
    const arrayJson: unknown = JSON.parse(list);
    if (
      !isTypeMatch(arrayJson, 'Array') ||
      !isArrayType(arrayJson, 'object') ||
      !arrayJson.every(
        (v) =>
          hasField(v, 'storageKey', 'string') &&
          hasField(v, 'playGamedataName', 'string')
      )
    ) {
      throw new InvalidJsonError('game_data_name_list is broken');
    }
    // ゲームデータ名のMapとSetを保管
    arrayJson.map((v) => {
      this.itemMap.set(v.storageKey, v.playGamedataName);
      this.names.add(v.playGamedataName);
    });
  }
  get length(): number {
    return this.itemMap.size;
  }
  collectGameDataNames(): Array<string> {
    return this.itemMap.values().toArray();
  }

  setGameDataName(key: string, name: string): boolean {
    // keyかnameが空文字、もしくは既に存在する名前なら変更不可
    if (key === '' || name === '' || this.names.has(name)) {
      return false;
    }
    // 既に存在するストレージキーならnamesから名前を削除しておく
    const oldName = this.itemMap.get(key);
    if (oldName !== undefined) {
      this.names.delete(oldName);
    }

    //ストレージキーと名前を保管、keyが既に存在するなら上書き
    this.itemMap.set(key, name);
    this.names.add(name);

    // ストレージキーと名前を紐づけてストレージに保存
    const itemList: Array<Item> = [];
    this.itemMap.entries().map((v) => itemList.push(new Item(v[0], v[1])));
    this.storage.setItem(
      Constant.GAME_DATA_NAME_LIST,
      JSON.stringify(itemList)
    );
    return true;
  }
  getCurrentGameDataKey(): string {
    const currentKey = this.storage.getItem(Constant.CURRENT_GAME_DATA_NAME);
    if (currentKey === null) {
      throw new KeyNotFoundError('not exist CURRENT_GAME_DATA_NAME');
    }
    return currentKey;
  }
  setCurrentGameDataKey(key: string): void {
    this.storage.setItem(Constant.CURRENT_GAME_DATA_NAME, key);
  }
}

export class Item {
  storageKey: string;
  playGamedataName: string;
  constructor(storageKey: string, playGamedataName: string) {
    this.storageKey = storageKey;
    this.playGamedataName = playGamedataName;
  }
}
