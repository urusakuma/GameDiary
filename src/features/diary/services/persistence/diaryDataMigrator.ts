import { inject, injectable } from 'tsyringe';

import type { IStorageService } from '@shared/utils/storageServiceInterface';
import { InvalidJsonError } from '@lib/error';
import {
  isTypeMatch,
  isArrayType,
  hasField,
} from '@shared/utils/checkTypeMatch';

import { IDiaryDataMigrator } from './diaryPersistenceInterfaces';
import STORAGE_CONSTANTS from '../constants';

@injectable()
export default class DiaryDataMigrator implements IDiaryDataMigrator {
  constructor(
    @inject('IStorageService')
    private storage: IStorageService
  ) {}
  migrate(): void {
    // current_game_data_nameが存在するならv0
    const v0CurrentDiaryKey = this.storage.getItem(
      STORAGE_CONSTANTS.CURRENT_GAME_DATA_NAME
    );
    if (v0CurrentDiaryKey !== null) {
      this.migrateV0toV1();
    }
    // v0でなければ今のところ最新
    // v1をv2に変更する処理を書く
  }
  /**
   * v0のデータをv1に整形する。
   */
  migrateV0toV1(): void {
    // CURRENT_GAME_DATA_NAMEをCURRENT_DIARY_KEYに名前変更
    const v0CurrentDiaryKey = this.storage.getItem(
      STORAGE_CONSTANTS.CURRENT_GAME_DATA_NAME
    );
    if (v0CurrentDiaryKey !== null) {
      this.storage.removeItem(STORAGE_CONSTANTS.CURRENT_GAME_DATA_NAME);
      this.storage.setItem(
        STORAGE_CONSTANTS.CURRENT_DIARY_KEY,
        v0CurrentDiaryKey
      );
    }

    // まず、itemListを初期化し、ストレージからゲームデータ名のリストを取得する。
    const diaryNameList = this.storage.getItem(
      STORAGE_CONSTANTS.GAME_DATA_NAME_LIST
    );
    if (diaryNameList === null) {
      return;
    }
    // 取得したJSONをゲームデータ名のリストに変換できるか確認
    const diaryNameJson: unknown = JSON.parse(diaryNameList);
    if (
      !isTypeMatch(diaryNameJson, 'Array') ||
      !isArrayType(diaryNameJson, 'object') ||
      !diaryNameJson.every(
        (v) =>
          hasField(v, 'storageKey', 'string') &&
          hasField(v, 'playGamedataName', 'string')
      )
    ) {
      throw new InvalidJsonError('game_data_name_list is broken');
    }
    const keyNamePairObj: Record<string, string> = {};
    // ゲームデータ名のリストをRecord<[string,string]>に変換
    diaryNameJson.map((v) => {
      keyNamePairObj[v.storageKey] = v.playGamedataName;
    });
    // gameDataListを削除
    this.storage.removeItem(STORAGE_CONSTANTS.GAME_DATA_NAME_LIST);
    // diaryNameListへと保存
    this.storage.setItem(
      STORAGE_CONSTANTS.DIARY_NAME_LIST,
      JSON.stringify(keyNamePairObj)
    );
  }
}
