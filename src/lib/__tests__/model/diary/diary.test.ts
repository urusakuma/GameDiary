import '@/container/di_diary';
import Diary from '@/model/diary/diary';
import {
  IDiaryEntry,
  IDiarySettings,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';

describe('DiarySettings class tests', () => {
  let entry: IDiaryEntry;
  let diaryEntries: Map<number, IDiaryEntry>;
  let settings: IDiarySettings;
  let builder: UsePreviousDayDiaryEntryFactory;
  let builtEntry: Array<IDiaryEntry>;
  let diary: Diary;

  const entryFactory = (day: number, previous: number | undefined) => {
    return {
      day,
      previous,
      next: undefined,
    } as unknown as jest.Mocked<IDiaryEntry>;
  };
  beforeEach(() => {
    entry = {
      day: 1,
      previous: undefined,
    } as unknown as jest.Mocked<IDiaryEntry>;
    settings = {
      getNextDay: jest.fn().mockReturnValueOnce(2).mockReturnValueOnce(3),
    } as unknown as jest.Mocked<IDiarySettings>;
    diaryEntries = new Map().set(1, entry);
    builtEntry = [entry];
    builder = (source: IDiaryEntry, settings: IDiarySettings) => {
      const sourceDay = source.day;
      const entry = entryFactory(settings.getNextDay(sourceDay), sourceDay);
      builtEntry.push(entry);
      return entry;
    };
    diary = new Diary(builder, diaryEntries, settings, 1);
  });
  describe('Mock tests', () => {
    it('should entryFactory return jest.Mocked<IDiaryEntry>', () => {
      const entry = entryFactory(2, 1);
      expect(entry.day).toBe(2);
      expect(entry.previous).toBe(1);
      expect(entry.next).toBeUndefined();
      entry.next = 3;
      expect(entry.next).toBe(3);
    });
  });
  describe('getSettings tests', () => {
    it('should return settings', () => {
      expect(diary.getSettings()).toBe(settings);
    });
  });
  describe('getLastDay tests', () => {
    it('should return lastDay', () => {
      expect(diary.getLastDay()).toBe(1);
    });
  });

  describe('getEntry tests', () => {
    it('should return existing entry', () => {
      expect(diary.getEntry(1)).toEqual(diaryEntries.get(1));
    });
    it('should throw error when entry not exists', () => {
      expect(() => diary.getEntry(2)).toThrow(`not exists day=2 entry`);
    });
  });
  describe('createNewEntry tests', () => {
    const nextDay = 99;
    beforeEach(() => {
      settings.getNextDay = jest.fn().mockReturnValue(nextDay);
    });
    it('should create new entry with getNextDay', () => {
      const day = diary.createNewEntry();
      expect(day).toBe(nextDay);
      expect(settings.getNextDay).toHaveBeenCalledTimes(1);
    });
    it('should save new entry into diaryEntries', () => {
      diary.createNewEntry();
      expect(diary.getEntry(nextDay)).toBe(builtEntry[1]);
    });
    it('should update previous entry next to new day', () => {
      expect(diary.getEntry(1).next).toBeUndefined();
      diary.createNewEntry();
      expect(diary.getEntry(1).next).toBe(nextDay);
    });
    it('should update lastDay to new day', () => {
      diary.createNewEntry();
      expect(diary.getLastDay()).toBe(nextDay);
    });
    it('should return new day', () => {
      const day = diary.createNewEntry();
      expect(day).toBe(nextDay);
    });
  });
  describe('test deleteEntry', () => {
    const lastDay = 5;
    beforeEach(() => {
      for (let i = 2; i <= lastDay; i++) {
        settings.getNextDay = jest.fn().mockReturnValue(i);
        diary.createNewEntry();
      }
    });
    it('should return false when entry does not exist', () => {
      const isDeleted = diary.deleteEntry(lastDay + 1);
      expect(isDeleted).toBeFalsy();
    });
    it('should delete lastDay entry and update lastDay to previous', () => {
      expect(diary.getEntry(lastDay)).not.toBeNull();
      const isDeleted = diary.deleteEntry(lastDay);
      expect(isDeleted).toBeTruthy();
      expect(() => diary.getEntry(lastDay)).toThrow(
        `not exists day=${lastDay} entry`
      );
    });
    it('should link previous and next when deleting middle entry', () => {
      expect(diary.getEntry(1).next).toBe(2);
      expect(diary.getEntry(3).previous).toBe(2);
      const isDeleted = diary.deleteEntry(2);
      expect(isDeleted).toBeTruthy();
      expect(diary.getEntry(1).next).toBe(3);
      expect(diary.getEntry(3).previous).toBe(1);
    });
    it('should not delete first entry', () => {
      const isDeleted = diary.deleteEntry(1);
      expect(isDeleted).toBeFalsy();
    });
  });
  describe('toJson tests', () => {
    it('should serialize settings, diaryEntries, and lastDay', () => {
      const lastDay = 5;
      const days = Array<number>(lastDay);
      days[0] = 1;
      for (let i = 2; i <= lastDay; i++) {
        settings.getNextDay = jest.fn().mockReturnValue(i);
        days[i - 1] = diary.createNewEntry();
      }
      interface DiaryJson {
        settings: IDiarySettings;
        diaryEntries: IDiaryEntry[];
        lastDay: number;
      }

      const json: DiaryJson = diary.toJSON() as DiaryJson;

      expect(json.settings).toEqual(settings);
      expect(Array.isArray(json.diaryEntries)).toBeTruthy();
      expect(json.diaryEntries.some((e, i) => e.day === days[i])).toBeTruthy();
      expect(json.lastDay).toBe(days.at(-1));
    });

    it('should be called automatically by JSON.stringify', () => {
      const str = JSON.stringify(diary);
      expect(str).toContain('"settings"');
      expect(str).toContain('"diaryEntries"');
      expect(str).toContain('"lastDay"');
    });
  });
});
