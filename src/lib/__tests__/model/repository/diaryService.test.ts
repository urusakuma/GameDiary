import 'reflect-metadata';
import DiaryService from '@/model/repository/diaryService';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import type {
  IDiary,
  IDiarySettings,
} from '@/model/diary/diaryModelInterfaces';
import { MockDiary } from '../../__mocks__/mockDiary';
import {
  IDiarySave,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';

describe('DiaryService', () => {
  let storage: jest.Mocked<IStorageService>;
  let diarySettings: IDiarySettings;
  let diaryService: IDiaryService;
  let diarySave: IDiarySave;
  const storageKey = 'storageKey1';
  let diary: IDiary = new MockDiary();
  beforeEach(() => {
    storage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    } as unknown as jest.Mocked<IStorageService>;
    diarySettings = { storageKey: storageKey } as unknown as IDiarySettings;
    diary = {
      getSettings: () => diarySettings,
    } as unknown as IDiary;
    diarySave = { save: jest.fn() } as IDiarySave;
  });

  describe('getDiary', () => {
    it('should return the diary for existing key', () => {
      diaryService = new DiaryService(diarySave, storage);
      diaryService.addDiary(diary);
      const result = diaryService.getDiary(storageKey);
      expect(result).toBe(diary);
    });
    it('should return undefined for non-existing diary', () => {
      diaryService = new DiaryService(diarySave, storage);
      const result = diaryService.getDiary('nonExistingKey');
      expect(result).toBeUndefined();
    });
  });

  describe('addDiary', () => {
    it('should add a diary and store it in storage', () => {
      diaryService = new DiaryService(diarySave, storage);
      diaryService.addDiary(diary);
      expect(diaryService.getDiary(storageKey)).toBe(diary);
      expect(diarySave.save).toHaveBeenCalledWith(diary);
    });
  });

  describe('deleteDiary', () => {
    it('should delete a diary and remove it from storage', () => {
      diaryService = new DiaryService(diarySave, storage);
      diaryService.addDiary(diary);
      expect(diaryService.getDiary(storageKey)).toBe(diary);

      diaryService.deleteDiary(storageKey);

      expect(diaryService.getDiary(storageKey)).toBeUndefined();
      expect(storage.removeItem).toHaveBeenCalledWith(storageKey);
    });
  });
});
