import {
  IDayModifier,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';
import DiarySettings from '@features/diary/model/diarySettings';

describe('DiarySettings class tests', () => {
  let modifier: IDayModifier;
  let settings: IDiarySettings;
  beforeEach(() => {
    modifier = {
      setModifier: jest.fn(),
      getModifier: jest.fn().mockReturnValue('modifier'),
      updateCycleLength: jest.fn(),
      getCycleLength: jest.fn().mockReturnValue(10),
      getUnit: jest.fn().mockReturnValue('unit'),
      updateUnit: jest.fn(),
      modifyDay: jest.fn(),
    } as unknown as IDayModifier;
    settings = new DiarySettings(modifier, 'name', 1, 'storageKey', 1);
  });

  describe('setDiaryName, getDiaryName tests', () => {
    it('should set and get diary name', () => {
      const name = 'My Diary';
      settings.setDiaryName(name);
      expect(settings.getDiaryName()).toBe(name);
    });
  });
  describe('setModifier tests', () => {
    it('should set modifier via IDayModifier', () => {
      const modStr = 'New Modifier';
      settings.setModifier(modStr);
      expect(modifier.setModifier).toHaveBeenCalledWith(modStr);
    });
  });

  describe('updateDaiInterval tests', () => {
    it('should update DayInterval to value when there is no problem', () => {
      settings.updateDayInterval(5);
      expect(settings.getDayInterval()).toBe(5);
    });
    it('should update DayInterval to 1 when provided value is less 1', () => {
      settings.updateDayInterval(0);
      expect(settings.getDayInterval()).toBe(1);
    });
    it('should truncate decimal values from DayInterval', () => {
      settings.updateDayInterval(2.999);
      expect(settings.getDayInterval()).toBe(2);
      settings.updateDayInterval(0.999);
      expect(settings.getDayInterval()).toBe(1);
    });
  });
  describe('updateCycleLength tests', () => {
    it('should update cycleLength via IDayModifier', () => {
      const cycleLength = 5;
      settings.updateCycleLength(cycleLength);
      expect(modifier.updateCycleLength).toHaveBeenCalledTimes(1);
      expect(modifier.updateCycleLength).toHaveBeenCalledWith(cycleLength);
    });
  });
  describe('setModifierUnit tests', () => {
    it('should update cycleLength via IDayModifier', () => {
      const str = 'test' + String(0);
      settings.updateModifierUnit(str, 0);
      expect(modifier.updateUnit).toHaveBeenCalledTimes(1);
      expect(modifier.updateUnit).toHaveBeenCalledWith(str, 0);
    });
  });

  describe('getNextDay tests', () => {
    it('should return next day correctly', () => {
      expect(settings.getNextDay(1)).toBe(2);
      expect(settings.getNextDay(10)).toBe(11);
    });
    it('should return DayInterval + 1 when provided day is less than 1', () => {
      expect(settings.getNextDay(0)).toBe(settings.getDayInterval() + 1);
      expect(settings.getNextDay(-5)).toBe(settings.getDayInterval() + 1);
    });
    it('should truncate decimal values from provided day', () => {
      expect(settings.getNextDay(2.999)).toBe(3); // 2+1=3
      expect(settings.getNextDay(0.999)).toBe(settings.getDayInterval() + 1);
    });
  });

  describe('getModifierDay tests', () => {
    it('should return modifierDay via IDayModifier', () => {
      settings.getModifierDay(1);
      expect(modifier.modifyDay).toHaveBeenCalledTimes(1);
      expect(modifier.modifyDay).toHaveBeenCalledWith(1);
    });
    it('should return modifier 1 when value less 1', () => {
      settings.getModifierDay(0);
      expect(modifier.modifyDay).toHaveBeenCalledWith(1);
    });
    it('should truncate decimal values from provided day', () => {
      settings.getModifierDay(2.999);
      expect(modifier.modifyDay).toHaveBeenCalledWith(2);
      settings.getModifierDay(0.999);
      expect(modifier.modifyDay).toHaveBeenCalledWith(1);
    });
  });
});
