import DiaryDataMigrator from '@/model/repository/diaryDataMigrator';
import { MockV0StorageService } from '../../__mocks__/mockV0StorageService';
import DiarySettingsConstant from '@/diarySettingsConstant';
import {
  hasField,
  isArrayType,
  isRecordType,
  isTypeMatch,
} from '@/model/utils/checkTypeMatch';
import { InvalidJsonError } from '@/error';
import { IStorageService } from '@/model/utils/storageServiceInterface';

describe('DiaryDataMigrator class tests', () => {
  let storage: IStorageService;
  beforeEach(() => {
    storage = new MockV0StorageService();
  });
  describe('v0 storage service mock', () => {
    let gameDataNameListJson: string;
    let gameDataNameEntries: GameDataNameEntry[];
    type GameDataNameEntry = {
      storageKey: string;
      playGamedataName: string;
    };
    beforeEach(() => {
      const json = storage.getItem(DiarySettingsConstant.GAME_DATA_NAME_LIST);
      if (json === null) {
        throw Error;
      }
      gameDataNameListJson = json;
      const list = JSON.parse(gameDataNameListJson);
      if (
        !isTypeMatch(list, 'Array') ||
        !isArrayType(list, 'object') ||
        !list.every(
          (v) =>
            hasField(v, 'storageKey', 'string') &&
            hasField(v, 'playGamedataName', 'string')
        )
      ) {
        throw new InvalidJsonError('gameDataNameList is broken');
      }
      gameDataNameEntries = list;
    });
    it('should store currentGameDataKey in current_game_data_name', () => {
      expect(
        storage.getItem(DiarySettingsConstant.CURRENT_GAME_DATA_NAME)
      ).toBe('testKey0');
    });
    it('should expose game_data_name_list as an array of objects', () => {
      expect(isTypeMatch(gameDataNameEntries, 'Array')).toBeTruthy();
    });
    it('should validate GameDataNameEntry structure in GAME_DATA_NAME_LIST', () => {
      // v0では配列の中に{storageKey: string, playGamedataName: string}の形で入っているはず
      expect(isArrayType(gameDataNameEntries, 'object')).toBeTruthy();
      expect(
        gameDataNameEntries.every(
          (v) =>
            hasField(v, 'storageKey', 'string') &&
            hasField(v, 'playGamedataName', 'string')
        )
      ).toBeTruthy();
    });
    it('should have 5 entries in GAME_DATA_NAME_LIST', () => {
      expect(gameDataNameEntries.length).toBe(5);
      for (let i = 0; i < 5; i++) {
        const item = gameDataNameEntries[i];
        expect(item.storageKey).toBe('testKey' + String(i));
        expect(item.playGamedataName).toBe('testName' + String(i));
      }
    });
  });
  describe('after migration', () => {
    let diaryNameListJson: string;
    let gameDataNameRecords: Record<string, string>;
    beforeEach(() => {
      new DiaryDataMigrator(storage).migrate();

      const s = storage.getItem(DiarySettingsConstant.DIARY_NAME_LIST);
      if (s === null) {
        throw Error;
      }
      diaryNameListJson = s;
      const obj = JSON.parse(diaryNameListJson);
      if (!isTypeMatch(obj, 'record') || !isRecordType(obj, 'string')) {
        throw new InvalidJsonError('diaryNameList is broken');
      }
      gameDataNameRecords = obj;
    });
    it('should rename current_game_data_name to current_diary_key', () => {
      expect(
        storage.getItem(DiarySettingsConstant.CURRENT_GAME_DATA_NAME)
      ).toBeNull();
      expect(storage.getItem(DiarySettingsConstant.CURRENT_DIARY_KEY)).toBe(
        'testKey0'
      );
    });
    it('should load diary_name_list from storage', () => {
      expect(diaryNameListJson).not.toBeNull();
    });
    it('should expose diary_name_list as a record', () => {
      expect(isTypeMatch(gameDataNameRecords, 'record')).toBeTruthy();
    });
    it('should have valid key/value pairs in diary_name_list', () => {
      expect(isRecordType(gameDataNameRecords, 'string')).toBeTruthy();
    });
    it('should have 5 entries in diary_name_list', () => {
      const diaryNameEntries = Object.entries(gameDataNameRecords);
      expect(diaryNameEntries.length).toBe(5);
      for (let i = 0; i < 5; i++) {
        const entry = diaryNameEntries[i];
        if (!isArrayType(entry, 'string')) {
          throw new InvalidJsonError('diaryNameList is broken');
        }
        expect(entry[0]).toBe('testKey' + String(i));
        expect(entry[1]).toBe('testName' + String(i));
      }
    });
  });
});
