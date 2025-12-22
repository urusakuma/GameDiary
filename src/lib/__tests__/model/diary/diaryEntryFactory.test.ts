import DiaryEntryFactory from '@/model/diary/diaryEntryFactory';
import {
  IDiaryEntry,
  IDiarySettings,
} from '@/model/diary/diaryModelInterfaces';
import DiaryEntry from '@/model/diary/diaryEntry';

describe('DiaryEntryFactory', () => {
  let factory: DiaryEntryFactory;
  beforeEach(() => {
    factory = new DiaryEntryFactory();
  });
  describe('createUsePreviousDay', () => {
    it('should create a new diary entry using the previous day', () => {
      const source: IDiaryEntry = {
        day: 1,
      } as unknown as IDiaryEntry;

      const settings: IDiarySettings = {
        getNextDay: jest.fn().mockReturnValue(2),
        getModifierDay: jest.fn().mockReturnValue('Day 2'),
      } as unknown as IDiarySettings;

      const result = factory.createUsePreviousDay(source, settings);

      expect(settings.getNextDay).toHaveBeenCalledWith(source.day);
      expect(settings.getModifierDay).toHaveBeenCalledWith(2);
      expect(result).toBeInstanceOf(DiaryEntry);
      expect(result.day).toBe(2);
      expect(result.getTitle()).toBe('Day 2');
      expect(result.getContent()).toBe('');
      expect(result.previous).toBe(1);
      expect(result.next).toBeUndefined();
    });
  });

  describe('createUseExistingData', () => {
    it('should create a new diary entry using exists date', () => {
      const day = 2;
      const title = 'Day 2';
      const content = 'Content for day 1';
      const previous = 1;
      const next = 3;

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
    it('should day be at least 1', () => {
      const result = factory.createUseExistingData(
        0,
        'Title',
        'Content',
        undefined,
        undefined
      );
      expect(result.day).toBe(1);
    });
    it('should previous be less than day', () => {
      const result = factory.createUseExistingData(
        3,
        'Title',
        'Content',
        4,
        undefined
      );
      expect(result.previous).toBe(2);
    });
    it('should next be greater than day', () => {
      const result = factory.createUseExistingData(
        2,
        'Title',
        'Content',
        undefined,
        1
      );
      expect(result.next).toBeUndefined();
    });
    it('should truncate decimal values', () => {
      const result = factory.createUseExistingData(
        2.9,
        'Title',
        'Content',
        1.7,
        3.5
      );
      expect(result.day).toBe(2);
      expect(result.previous).toBe(1);
      expect(result.next).toBe(3);
    });
  });
});
