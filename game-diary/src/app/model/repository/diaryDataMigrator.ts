import { inject, injectable } from 'tsyringe';
import { IDiaryDataMigrator } from './diaryRepositoryInterfaces';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import { InvalidJsonError } from '@/error';
import {
  isTypeMatch,
  isArrayType,
  hasField,
} from '@/model/utils/checkTypeMatch';
@injectable()
export class DiaryDataMigrator implements IDiaryDataMigrator {
  constructor(
    @inject('IStorageService')
    private storage: IStorageService
  ) {}
  migrate(): void {
    // current_game_data_nameが存在するならv0
    const v0CurrentDiaryKey = this.storage.getItem(
      DairySettingsConstant.CURRENT_GAME_DATA_NAME
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
    const v0CurrentDiaryKey = this.storage.getItem(
      DairySettingsConstant.CURRENT_GAME_DATA_NAME
    );
    if (v0CurrentDiaryKey !== null) {
      this.storage.setItem(
        DairySettingsConstant.CURRENT_DIARY_KEY,
        v0CurrentDiaryKey
      );
      this.storage.removeItem(DairySettingsConstant.CURRENT_GAME_DATA_NAME);
    }

    // まず、itemListを初期化し、ストレージからゲームデータ名のリストを取得する。
    const diaryNameList = this.storage.getItem(
      DairySettingsConstant.DIARY_NAME_LIST
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
    const keyNamePairList: Array<[string, string]> = new Array();
    // ゲームデータ名のリストをArray<[string,string]>に変換
    diaryNameJson.map((v) => {
      keyNamePairList.push([v.storageKey, v.playGamedataName]);
    });
    // データを上書き
    this.storage.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify(keyNamePairList)
    );
  }
}
