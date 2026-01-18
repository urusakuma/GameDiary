import DiaryNameManager from '@/model/repository/diaryNameManager';
import { IDiaryNameManager } from '@/model/repository/diaryRepositoryInterfaces';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { InvalidJsonError } from '@/error';
import DiarySettingsConstant from '@/diarySettingsConstant';

describe('DiaryNameManager class tests', () => {
  let diaryNameManager: IDiaryNameManager;
  let diaryRecord: Record<string, string>;
  let mockStorage: jest.Mocked<IStorageService>;
  beforeEach(() => {
    diaryRecord = {};
    // 初期データの読み込み
    for (let i = 0; i < 5; i++) {
      const itemName = 'testName' + String(i);
      diaryRecord['testKey' + String(i)] = itemName;
    }
    mockStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(diaryRecord)),
      setItem: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<IStorageService>;
  });
  describe('constructor tests', () => {
    it('should load diary names from valid storage', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      expect(diaryNameManager.collectDiaryNameEntries()).toMatchObject(
        Object.entries(diaryRecord)
      );
    });
    it('should handle null storage item', () => {
      mockStorage.getItem.mockReturnValue(null);
      diaryNameManager = new DiaryNameManager(mockStorage);
      expect(diaryNameManager.length).toBe(0);
    });
    it('should throw InvalidJsonError for invalid JSON structure', () => {
      mockStorage.getItem.mockReturnValue('["invalid","json"]');
      expect(() => {
        diaryNameManager = new DiaryNameManager(mockStorage);
      }).toThrow(new InvalidJsonError('diary_name_list is broken'));
    });
  });
  describe('length tests', () => {
    it('should return the number of stored diary names', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      expect(diaryNameManager.length).toBe(Object.keys(diaryRecord).length);
    });
  });
  describe('updateDiaryName tests', () => {
    it('should update diary name and return true', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      const result = diaryNameManager.updateDiaryName(
        'testKey1',
        'updatedTestName'
      );
      expect(result).toBeTruthy();
      expect(diaryNameManager.getDiaryName('testKey1')).toBe('updatedTestName');
      diaryRecord['testKey1'] = 'updatedTestName';
      expect(diaryNameManager.length).toBe(Object.keys(diaryRecord).length);
      expect(diaryNameManager.collectDiaryNameEntries()).toEqual(
        expect.arrayContaining(Object.entries(diaryRecord))
      );
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        DiarySettingsConstant.DIARY_NAME_LIST,
        JSON.stringify(diaryRecord)
      );
    });
    it('should not update diary name with empty key', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      const result = diaryNameManager.updateDiaryName('', 'newTestName');
      expect(result).toBe(false);
      expect(diaryNameManager.getDiaryName('testKey1')).toBe('testName1');
    });
    it('should not update diary name with empty name', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      const result = diaryNameManager.updateDiaryName('testKey1', '');
      expect(result).toBe(false);
      expect(diaryNameManager.getDiaryName('testKey1')).toBe('testName1');
    });
    it('should not update diary name with existing name', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      const result = diaryNameManager.updateDiaryName('testKey1', 'testName2');
      expect(result).toBeFalsy();
      expect(diaryNameManager.getDiaryName('testKey1')).toBe('testName1');
    });

    it('should add a new diary name', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      const result = diaryNameManager.updateDiaryName(
        'addTestKey',
        'addTestName'
      );
      expect(result).toBeTruthy();

      diaryRecord['addTestKey'] = 'addTestName';
      expect(diaryNameManager.length).toBe(Object.keys(diaryRecord).length);
      expect(diaryNameManager.collectDiaryNameEntries()).toEqual(
        expect.arrayContaining(Object.entries(diaryRecord))
      );
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        DiarySettingsConstant.DIARY_NAME_LIST,
        JSON.stringify(diaryRecord)
      );
    });
    it('should revert changes if storage setItem fails', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      mockStorage.setItem.mockReturnValue(false);
      const result = diaryNameManager.updateDiaryName(
        'testKey1',
        'failedUpdateName'
      );
      expect(result).toBeFalsy();
      expect(diaryNameManager.getDiaryName('testKey1')).toBe('testName1');
      expect(diaryNameManager.length).toBe(Object.keys(diaryRecord).length);
      expect(diaryNameManager.collectDiaryNameEntries()).toEqual(
        expect.arrayContaining(Object.entries(diaryRecord))
      );
      expect(diaryNameManager.hasDiaryName('failedUpdateName')).toBeFalsy();
      expect(diaryNameManager.hasDiaryName('testName1')).toBeTruthy();
    });
  });
  describe('removeDiaryName tests', () => {
    it('should remove diary name for the given key', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      diaryNameManager.removeDiaryName('testKey2');
      expect(diaryNameManager.getDiaryName('testKey2')).toBeUndefined();
      expect(diaryNameManager.length).toBe(Object.keys(diaryRecord).length - 1);
    });
    it('should do nothing for non-existing key', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      diaryNameManager.removeDiaryName('nonExistingKey');
      expect(diaryNameManager.length).toBe(Object.keys(diaryRecord).length);
    });
  });
  describe('collectDiaryNameEntries tests', () => {
    it('should collect all diary name entries', () => {
      diaryNameManager = new DiaryNameManager(mockStorage);
      const entries = diaryNameManager.collectDiaryNameEntries();
      expect(entries).toHaveLength(Object.keys(diaryRecord).length);
      expect(entries).toEqual(
        expect.arrayContaining(Object.entries(diaryRecord))
      );
    });
  });
});
