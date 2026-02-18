import 'reflect-metadata';
import DiaryFactory from '@features/diary/model/factories/diaryFactory';
import Diary from '@features/diary/model/diary';
import type {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
  IDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@features/diary/model/diaryModelInterfaces';

describe('DiaryFactory', () => {
  let newEntriesFactory: () => Map<number, IDiaryEntry>;
  let settingsFactory: IDiarySettingsFactory;
  let entryFactory: UsePreviousDayDiaryEntryFactory;
  let diaryFactory: DiaryFactory;
  const entry = {} as IDiaryEntry;
  const entries = new Map<number, IDiaryEntry>().set(1, entry);
  const settings = {} as unknown as IDiarySettings;
  const name = 'DiaryName';
  const otherSettings = {} as unknown as IDiarySettings;
  const otherDiary = {
    getSettings: jest.fn().mockReturnValue(otherSettings),
  } as unknown as IDiary;

  beforeEach(() => {
    newEntriesFactory = jest.fn().mockReturnValue(entries);
    settingsFactory = {
      createUseExistingData: jest.fn().mockReturnValue(settings),
      createNewDiarySettings: jest.fn().mockReturnValue(settings),
    } as unknown as IDiarySettingsFactory;
    entryFactory = jest.fn();
    diaryFactory = new DiaryFactory(
      newEntriesFactory,
      settingsFactory,
      entryFactory
    );
  });
  describe('createUseExistingData tests', () => {
    it('should create a diary using existing data with provided entries, settings, and lastDay', () => {
      const diary = diaryFactory.createUseExistingData(entries, settings, 1);
      expect(diary).toBeInstanceOf(Diary);
      expect(diary.getEntry(1)).toBe(entry);
      expect(diary.getSettings()).toBe(settings);
      expect(diary.getLastDay()).toBe(1);
    });
    it('should set lastDay to 1 when lastDay is less than 1', () => {
      const diary = diaryFactory.createUseExistingData(entries, settings, 0);
      expect(diary.getLastDay()).toBe(1);
    });
    it('should set lastDay to 1 when entry for lastDay does not exist', () => {
      const diary = diaryFactory.createUseExistingData(entries, settings, 2);
      expect(diary.getLastDay()).toBe(1);
    });
    it('should truncate decimal values from lastDay', () => {
      let diary = diaryFactory.createUseExistingData(entries, settings, 0.999);
      expect(diary.getLastDay()).toBe(1);
      diary = diaryFactory.createUseExistingData(entries, settings, 1.999);
      expect(diary.getLastDay()).toBe(1);
    });
    it('should call newEntriesFactory when diaryEntries is empty', () => {
      const diary = diaryFactory.createUseExistingData(new Map(), settings, 2);
      expect(diary.getEntry(1)).toBe(entry);
      expect(newEntriesFactory).toHaveBeenCalledTimes(1);
    });
  });
  describe('createNewDiary tests', () => {
    it('should create a new diary with fresh entries and default lastDay set to 1', () => {
      const diary = diaryFactory.createNewDiary();
      expect(diary).toBeInstanceOf(Diary);
      expect(diary.getEntry(1)).toBe(entry);
      expect(diary.getLastDay()).toBe(1);
      expect(diary.getSettings()).toBe(settings);
      expect(newEntriesFactory).toHaveBeenCalledTimes(1);
    });
    it('should pass existing settings to createNewDiarySettings when a diary is provided', () => {
      const diary = diaryFactory.createNewDiary(otherDiary);
      expect(diary.getSettings()).toBe(settings);
      expect(diary.getSettings()).not.toBe(otherSettings);
      expect(otherDiary.getSettings).toHaveBeenCalledTimes(1);
      expect(settingsFactory.createNewDiarySettings).toHaveBeenCalledTimes(1);
      expect(settingsFactory.createNewDiarySettings).toHaveBeenCalledWith(
        otherSettings,
        undefined
      );
    });
    it('should use provided name when creating new diary settings', () => {
      const diary = diaryFactory.createNewDiary(undefined, name);
      expect(settingsFactory.createNewDiarySettings).toHaveBeenCalledTimes(1);
      expect(settingsFactory.createNewDiarySettings).toHaveBeenCalledWith(
        undefined,
        name
      );
    });
  });
});
