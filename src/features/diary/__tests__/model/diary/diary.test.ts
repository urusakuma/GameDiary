import Diary from '@features/diary/model/diary';
import {
  IDiaryEntry,
  IDiarySettings,
  UsePreviousDayDiaryEntryFactory,
} from '@features/diary/model/diaryModelInterfaces';

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
      isEdited: () => false,
    } as unknown as jest.Mocked<IDiaryEntry>;
  };
  beforeEach(() => {
    entry = {
      day: 1,
      previous: undefined,
      next: undefined,
      isEdited: () => false,
    } as unknown as jest.Mocked<IDiaryEntry>;
    settings = {
      getNextDay: jest.fn().mockReturnValueOnce(2).mockReturnValueOnce(3),
    } as unknown as jest.Mocked<IDiarySettings>;
    diaryEntries = new Map().set(1, entry);
    builtEntry = [entry];
    builder = (source: IDiaryEntry, settings: IDiarySettings) => {
      const entry = entryFactory(settings.getNextDay(source.day), source.day);
      builtEntry.push(entry);
      source.next = entry.day;
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

  describe('getNextEntry tests', () => {
    it('should return undifined if no next entry', () => {
      expect(diary.getNextEntry(1)).toBeUndefined();
    });
    it('should return next entry', () => {
      const nextDay = diary.createNewEntry();
      expect(diary.getNextEntry(1)).toBe(diary.getEntry(nextDay));
    });
  });

  describe('getPreviousEntry tests', () => {
    beforeEach(() => {
      const newEntry = builder(entry, settings);
      diaryEntries = new Map().set(1, entry).set(2, newEntry);
      diary = new Diary(builder, diaryEntries, settings, 1);
    });
    it('should return previous entry day', () => {
      expect(diary.getPreviousEntry(2)).toBe(diary.getEntry(1));
    });
    it('should return this day if no previous entry', () => {
      expect(diary.getPreviousEntry(1)).toBe(diary.getEntry(1));
    });
  });

  describe('pruneTrailingUneditedEntries tests', () => {
    beforeEach(() => {
      for (let i = 2; i < 4; i++) {
        const newEntry = entryFactory(i, i - 1);
        diaryEntries.set(i, newEntry);
        builtEntry.push(newEntry);
      }
      diary = new Diary(builder, diaryEntries, settings, 3);
    });
    it('should correctly diaryEntries before pruning', () => {
      for (let i = 1; i < 4; i++) {
        expect(diary.getEntry(i)).toBe(builtEntry[i - 1]);
      }
    });
    it('should not delete farst day', () => {
      diary.pruneTrailingUneditedEntries(0);
      expect(diary.getEntry(1)).toBe(builtEntry[0]);
    });
    it('should delete entries after lastEditedDay', () => {
      diary.pruneTrailingUneditedEntries(1);
      expect(() => diary.getEntry(2)).toThrow(`not exists day=2 entry`);
      expect(() => diary.getEntry(3)).toThrow(`not exists day=3 entry`);
    });
    it('should update lastDay to lastEditedDay', () => {
      diary.pruneTrailingUneditedEntries(2);
      expect(diary.getLastDay()).toBe(2);
    });
    it('should not delete entries before lastEditedDay', () => {
      diary.pruneTrailingUneditedEntries(2);
      expect(diary.getEntry(2)).toBe(builtEntry[1]);
    });
    it('should not delete entries when the entry edited', () => {
      builtEntry[2].isEdited = () => true;
      diary.pruneTrailingUneditedEntries(3);
      expect(diary.getEntry(3)).toBe(builtEntry[2]);
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
