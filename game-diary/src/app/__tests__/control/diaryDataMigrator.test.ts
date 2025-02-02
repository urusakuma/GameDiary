import { IDiaryDataMigrator } from '@/control/diaryControlInterfaces';
import { DiaryDataMigrator } from '@/control/diaryDataMigrator';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { container } from 'tsyringe';
import { MockV0StorageService } from '../__mocks__/mockV0StorageService';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import {
  hasField,
  isArrayType,
  isTypeMatch,
} from '@/model/utils/checkTypeMatch';
import { InvalidJsonError } from '@/error';

describe('DiaryDataMigrator class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockV0StorageService
    );
    container.register<IDiaryDataMigrator>('IDiaryDataMigrator', {
      useClass: DiaryDataMigrator,
    });
  });
  test('v0 storage test', () => {
    const storage = container.resolve<IStorageService>('IStorageService');

    expect(storage.getItem(DairySettingsConstant.CURRENT_GAME_DATA_NAME)).toBe(
      'testKey0'
    );
    const gameDataNameListJson = storage.getItem(
      DairySettingsConstant.DIARY_NAME_LIST
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
      throw new InvalidJsonError('game_data_name_list is broken');
    }
    for (let i = 0; i < 5; i++) {
      const item = gameDataNameJson[i];
      expect(item.storageKey).toBe('testKey' + String(i));
      expect(item.playGamedataName).toBe('testName' + String(i));
    }
  });
  test('v0 migrator', () => {
    const storage = container.resolve<IStorageService>('IStorageService');
    container.resolve<IDiaryDataMigrator>('IDiaryDataMigrator').migrate();
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
    const keyNamePairList = JSON.parse(keyNamePairJson);

    if (
      !isTypeMatch(keyNamePairList, 'Array') ||
      !isArrayType(keyNamePairList, 'object')
    ) {
      throw new InvalidJsonError('game_data_name_list is broken');
    }
    for (let i = 0; i < 5; i++) {
      const pair = keyNamePairList[i];
      if (!isTypeMatch(pair, 'Array') || !isArrayType(pair, 'string')) {
        throw new InvalidJsonError('game_data_name_list is broken');
      }
      expect(pair[0]).toBe('testKey' + String(i));
      expect(pair[1]).toBe('testName' + String(i));
    }
  });
});
