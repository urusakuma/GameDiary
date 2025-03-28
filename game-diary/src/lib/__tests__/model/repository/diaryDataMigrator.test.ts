import { DiaryDataMigrator } from 'src/lib/model/repository/diaryDataMigrator';
import { MockV0StorageService } from '../../__mocks__/mockV0StorageService';
import { DairySettingsConstant } from 'src/lib/dairySettingsConstant';
import {
  hasField,
  isArrayType,
  isTypeMatch,
} from 'src/lib/model/utils/checkTypeMatch';
import { InvalidJsonError } from 'src/lib/error';

describe('DiaryDataMigrator class tests', () => {
  test('is the storage v0 test', () => {
    const storage = new MockV0StorageService();

    expect(storage.getItem(DairySettingsConstant.CURRENT_GAME_DATA_NAME)).toBe(
      'testKey0'
    );
    const gameDataNameListJson = storage.getItem(
      DairySettingsConstant.GAME_DATA_NAME_LIST
    );
    expect(gameDataNameListJson).not.toBeNull();
    if (gameDataNameListJson === null) {
      throw Error;
    }
    const gameDataNameJson = JSON.parse(gameDataNameListJson);
    if (
      !isTypeMatch(gameDataNameJson, 'Array') ||
      !isArrayType(gameDataNameJson, 'object') ||
      !gameDataNameJson.every(
        (v) =>
          hasField(v, 'storageKey', 'string') &&
          hasField(v, 'playGamedataName', 'string')
      )
    ) {
      throw new InvalidJsonError('gameDataNameList is broken');
    }
    for (let i = 0; i < 5; i++) {
      const item = gameDataNameJson[i];
      expect(item.storageKey).toBe('testKey' + String(i));
      expect(item.playGamedataName).toBe('testName' + String(i));
    }
  });
  test('v0 migrator', () => {
    const storage = new MockV0StorageService();
    new DiaryDataMigrator(storage).migrate();
    expect(
      storage.getItem(DairySettingsConstant.CURRENT_GAME_DATA_NAME)
    ).toBeNull();
    expect(storage.getItem(DairySettingsConstant.CURRENT_DIARY_KEY)).toBe(
      'testKey0'
    );
    const keyNamePairJson = storage.getItem(
      DairySettingsConstant.DIARY_NAME_LIST
    );
    if (keyNamePairJson === null) {
      throw Error;
    }
    const keyNamePairObj = JSON.parse(keyNamePairJson);

    if (!isTypeMatch(keyNamePairObj, 'record')) {
      throw new InvalidJsonError('diaryNameList is broken');
    }
    const keyNamePairList = Object.entries(keyNamePairObj);
    for (let i = 0; i < 5; i++) {
      const pair = keyNamePairList[i];
      if (!isArrayType(pair, 'string')) {
        throw new InvalidJsonError('diaryNameList is broken');
      }
      expect(pair[0]).toBe('testKey' + String(i));
      expect(pair[1]).toBe('testName' + String(i));
    }
  });
});
