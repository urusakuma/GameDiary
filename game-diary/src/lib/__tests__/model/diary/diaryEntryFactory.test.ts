import DiaryEntryFactory from '@/model/diary/diaryEntryFactory';
import {
  IDiaryEntry,
  IDiarySettings,
} from '@/model/diary/diaryModelInterfaces';
import { DiaryEntry } from '@/model/diary/diaryEntry';

describe('DiaryEntryFactory', () => {
  describe('createUsePreviousDay', () => {
    it('should create a new diary entry using the previous day', () => {
      const source: IDiaryEntry = {
        day: 1,
        getTitle: () => 'Day 1',
        getContent: () => 'Content for day 1',
        previous: undefined,
        next: undefined,
      } as unknown as IDiaryEntry;

      const settings: IDiarySettings = {
        getNextDay: jest.fn().mockReturnValue(2),
        getModifierDay: jest.fn().mockReturnValue('Day 2'),
      } as unknown as IDiarySettings;

      const factory = new DiaryEntryFactory();
      const result = factory.createUsePreviousDay(source, settings);

      expect(settings.getNextDay).toHaveBeenCalledWith(source.day);
      expect(settings.getModifierDay).toHaveBeenCalledWith(2);
      expect(result).toBeInstanceOf(DiaryEntry);
      expect(result.day).toBe(1);
      expect(result.getTitle()).toBe('Day 2');
      expect(result.getContent()).toBe('');
      expect(result.previous).toBe(1);
      expect(result.next).toBeUndefined();
    });
    it('should create a new diary entry using exists date', () => {
      const day = 1;
      const title = 'Day 1';
      const content = 'Content for day 1';
      const previous = 1;
      const next = 3;

      const settings: IDiarySettings = {
        getNextDay: jest.fn().mockReturnValue(2),
        getModifierDay: jest.fn().mockReturnValue('Day 2'),
      } as unknown as IDiarySettings;

      const factory = new DiaryEntryFactory();
      const result = factory.createUseExistingData(
        day,
        title,
        content,
        previous,
        next
      );

      expect(result).toBeInstanceOf(DiaryEntry);
      expect(result.day).toBe(day);
      expect(result.getTitle()).toBe(title);
      expect(result.getContent()).toBe(content);
      expect(result.previous).toBe(previous);
      expect(result.next).toBe(next);
    });
  });
});
