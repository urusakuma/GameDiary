import {
  IDiaryEntry,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';
import DiaryEntry from '@features/diary/model/diaryEntry';

describe('DiaryEntry class tests', () => {
  let entry: IDiaryEntry;
  beforeEach(() => {
    entry = new DiaryEntry(1, '', '', undefined, undefined);
  });

  describe('setTitle and getTitle tests', () => {
    it('should return the same value set by setTitle ', () => {
      const title = '1日目 テストをしてみる';
      entry.setTitle(title);
      expect(entry.getTitle()).toBe(title);
    });
  });
  describe('setContent and getContent tests', () => {
    it('should return the same value set by setContent ', () => {
      const setContent = 'テストを書いてみる';
      entry.setContent(setContent);
      expect(entry.getContent()).toBe(setContent);
    });
  });
  describe('previous tests', () => {
    beforeEach(() => {
      entry = new DiaryEntry(10, '', '', 1, undefined);
    });
    it('should set previous when given a positive day smaller than the current day', () => {
      entry.previous = 2;
      expect(entry.previous).toBe(2);
    });
    it('should truncate non-integer values before assigning to previous', () => {
      entry.previous = 2.999;
      expect(entry.previous).toBe(2);
    });
    it('should not update previous when value is greater than or equal to current day', () => {
      entry.previous = 10;
      expect(entry.previous).toBe(1);
      entry.previous = 11;
      expect(entry.previous).toBe(1);
    });
    it('should not update previous when value is zero or negative', () => {
      entry.previous = 0;
      expect(entry.previous).toBe(1);
      entry.previous = -1;
      expect(entry.previous).toBe(1);
    });
  });
  describe('next tests', () => {
    beforeEach(() => {
      entry = new DiaryEntry(10, '', '', 1, 11);
    });
    it('should set next when given a day greater than the current day', () => {
      entry.next = 12;
      expect(entry.next).toBe(12);
    });
    it('should truncate non-integer values before assigning to next', () => {
      entry.next = 12.999;
      expect(entry.next).toBe(12);
    });
    it('should not update next when value is less than or equal to current day', () => {
      entry.next = 9;
      expect(entry.next).toBe(11);
    });
    it('should set next to undefined when value is undefine', () => {
      entry.next = undefined;
      expect(entry.next).toBeUndefined();
    });
  });
  describe('', () => {
    const defaultTitle = '1日目';
    const editedTitle = '1日目 test title';
    const content = 'test content';
    const settings = {
      getModifierDay: jest.fn().mockReturnValue(defaultTitle),
    } as unknown as IDiarySettings;

    it('should return false when both title and content are empty', () => {
      entry.setTitle('');
      entry.setContent('');
      expect(entry.isEdited(settings)).toBeFalsy();
    });
    it('should return false when title is the default value and content is empty', () => {
      entry.setTitle(defaultTitle);
      entry.setContent('');
      expect(entry.isEdited(settings)).toBeFalsy();
    });
    it('should return true when content is not empty regardless of title', () => {
      entry.setTitle(defaultTitle);
      entry.setContent(content);
      expect(entry.isEdited(settings)).toBeTruthy();
      entry.setTitle('');
      expect(entry.isEdited(settings)).toBeTruthy();
      entry.setTitle(editedTitle);
      expect(entry.isEdited(settings)).toBeTruthy();
    });
    it('should return true when title is different from the default and content is empty', () => {
      entry.setTitle(editedTitle);
      entry.setContent('');
      expect(entry.isEdited(settings)).toBeTruthy();
    });
  });
  describe('toJSON', () => {
    interface EntryJson {
      day: number;
      title: string;
      content: string;
      next: number;
      previous: number | undefined;
    }
    const day = 2;
    const title = '2日目';
    const content = 'test content';
    const previous = 1;
    const next = 3;
    let entryJson: EntryJson;
    beforeEach(() => {
      entry = new DiaryEntry(day, title, content, previous, next);
    });
    it('should return an object containing day, title, content, and next', () => {
      entryJson = entry.toJSON() as EntryJson;
      expect(entryJson.day).toBe(day);
      expect(entryJson.title).toBe(title);
      expect(entryJson.content).toBe(content);
      expect(entryJson.next).toBe(next);
    });
    it('should not include the previous property in the JSON output', () => {
      entryJson = entry.toJSON() as EntryJson;
      expect(entryJson.previous).toBeUndefined();
    });
    it('should handle empty strings and null values without errors', () => {
      entry = new DiaryEntry(1, '', '', undefined, undefined);
      entryJson = entry.toJSON() as EntryJson;
      expect(entryJson.title).toBe('');
      expect(entryJson.content).toBe('');
      expect(entryJson.next).toBeUndefined();
    });
  });
});
