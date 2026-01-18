import 'reflect-metadata';
import CurrentDiaryManager from '@/model/repository/currentDiaryManager';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import DiarySettingsConstant from '@/diarySettingsConstant';

describe('CurrentDiaryManager', () => {
  let storage: jest.Mocked<IStorageService>;
  const diaryKey = 'test-key';
  beforeEach(() => {
    storage = {
      getItem: jest.fn().mockReturnValue(diaryKey),
      setItem: jest.fn(),
    } as unknown as jest.Mocked<IStorageService>;
  });
  describe('constructor', () => {
    it('should read currentDiaryKey when can use storage', () => {
      const manager = new CurrentDiaryManager(storage);
      expect(manager.getCurrentDiaryKey()).toBe(diaryKey);
    });
    it('should set empty string when can not read currentDiaryKey from storage', () => {
      storage.getItem.mockReturnValue(null);
      const manager = new CurrentDiaryManager(storage);
      expect(manager.getCurrentDiaryKey()).toBe('');
    });
  });
  describe('getCurrentDiaryKey', () => {
    it('should return the currentDiaryKey', () => {
      const manager = new CurrentDiaryManager(storage);
      expect(manager.getCurrentDiaryKey()).toBe(diaryKey);
    });
    it('should read from storage if reading currentDiaryKey previously failed', () => {
      storage.getItem.mockReturnValueOnce(null).mockReturnValue(diaryKey);
      const manager = new CurrentDiaryManager(storage);
      expect(manager.getCurrentDiaryKey()).toBe(diaryKey);
      expect(storage.getItem).toHaveBeenCalledWith(
        DiarySettingsConstant.CURRENT_DIARY_KEY
      );
    });
  });
  describe('setCurrentDiaryKey', () => {
    it('should set currentDiaryKey', () => {
      const manager = new CurrentDiaryManager(storage);
      manager.setCurrentDiaryKey(diaryKey);
      expect(manager.getCurrentDiaryKey()).toBe(diaryKey);
      expect(storage.setItem).toHaveBeenCalledWith(
        DiarySettingsConstant.CURRENT_DIARY_KEY,
        diaryKey
      );
    });
  });
});
