import DiarySettingsConstant from '@/diarySettingsConstant';
import { IDayModifier, Placeholders } from '@/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';
import '@/container/di_diary';

describe('DayModifier class tests', () => {
  let modifier: IDayModifier;
  const placeholders = container.resolve<Placeholders>('Placeholders');
  const dateModifierLabel =
    placeholders.year +
    '年目' +
    placeholders.cycle +
    placeholders.day +
    '日目' +
    placeholders.totalDay;
  beforeEach(() => {
    modifier = container.resolve<IDayModifier>('IDayModifier');
  });
  describe('Dependency Injection tests', () => {
    it('should regist container', () => {
      expect(modifier.getModifier()).toBe(
        DiarySettingsConstant.DEFAULT_DAY_MODIFIER
      );
      expect(modifier.getCycleLength()).toBe(
        DiarySettingsConstant.DEFAULT_CYCLE_LENGTH
      );
      for (let i = 0; i < 4; i++) {
        expect(modifier.getUnit(i)).toBe('');
      }
      expect(modifier.getModifier()).toBe(
        DiarySettingsConstant.DEFAULT_DAY_MODIFIER
      );
    });
  });
  describe('getUnit', () => {
    it('should return a value between 0 to 4, otherwise it should return an empty string', () => {
      for (let i = -1; i < 5; i++) {
        modifier.updateUnit(`Unit${i}`, i);
        if (i >= 0 && i < 4) {
          expect(modifier.getUnit(i)).toBe(`Unit${i}`);
        } else {
          expect(modifier.getUnit(i)).toBe('');
        }
      }
    });
    it('should truncate the fractional of index when the argument is not an integer', () => {
      for (let i = 1; i < 5; i++) {
        modifier.updateUnit(`Unit${i - 1}`, i - 1);
        expect(modifier.getUnit(i - 0.001)).toBe('Unit' + (i - 1));
      }
    });
  });
  it('modifyDay should truncate the fractional part when the argument is not an integer', () => {});
  describe('setModifier', () => {
    it('should set the argument as is', () => {
      modifier.setModifier('フェーズ');
      expect(modifier.modifyDay(1)).toBe('1フェーズ');
    });
  });
  describe('updateCycleLength and getCycleLength', () => {
    it('should be not less than 1', () => {
      const testCycleLength = [0, 0.999];
      testCycleLength.forEach((val) => {
        modifier.updateCycleLength(val);
        expect(modifier.getCycleLength()).toBe(
          DiarySettingsConstant.DEFAULT_CYCLE_LENGTH
        );
      });
    });
    it('should be an integer', () => {
      modifier.updateCycleLength(3.999);
      expect(modifier.getCycleLength()).toBe(3);
    });
  });
  describe('updateUnit', () => {
    it('should set the value when argument is 0 to 3', () => {
      const units = Array.from({ length: 4 }, (_, i) => `Unit${i}`);
      units.forEach((val, i) => {
        modifier.updateUnit(val, i);
      });
      units.forEach((val, i) => {
        expect(modifier.getUnit(i)).toBe(val);
      });
    });
    it('should not affect the value when argument is outside 0 to 3', () => {
      const units = Array.from({ length: 6 }, (_, i) => `Unit${i - 1}`);
      units.forEach((val, i) => {
        modifier.updateUnit(val, i - 1);
      });
      [-1, 4].forEach((i) => {
        expect(modifier.getUnit(i)).toBe('');
      });
      [0, 1, 2, 3].forEach((i) => {
        expect(modifier.getUnit(i)).toBe(`Unit${i}`);
      });
    });
  });

  describe('modifyDay', () => {
    it('should append modifier at the end if replacement string does not exist', () => {
      expect(modifier.modifyDay(1)).toBe('1日目');
    });
    it('should not use unit if replacement string does not exist', () => {
      modifier.setModifier('フェーズ').updateUnit('Hoge', 1);
      expect(modifier.modifyDay(1)).toBe('1フェーズ');
    });
    it('should replace when a replacement string for TotalDay exists', () => {
      modifier.setModifier('フェーズ' + placeholders.totalDay);
      expect(modifier.modifyDay(1)).toBe('フェーズ1');
    });
    it('should alternate between two cycles', () => {
      modifier
        .setModifier(dateModifierLabel)
        .updateUnit('前期', 0)
        .updateUnit('後期', 1);
      expect(modifier.modifyDay(1)).toBe('1年目前期1日目1');
      expect(modifier.modifyDay(10)).toBe('1年目前期10日目10');
      expect(modifier.modifyDay(11)).toBe('1年目後期1日目11');
      expect(modifier.modifyDay(20)).toBe('1年目後期10日目20');
      expect(modifier.modifyDay(21)).toBe('2年目前期1日目21');
      expect(modifier.modifyDay(2000)).toBe('100年目後期10日目2000');
    });
    it('Should be removed when the unit is deleted', () => {
      modifier
        .setModifier(dateModifierLabel)
        .updateUnit('前期', 0)
        .updateUnit('後期', 1);
      expect(modifier.modifyDay(10)).toBe('1年目前期10日目10');
      expect(modifier.modifyDay(20)).toBe('1年目後期10日目20');
      modifier.updateUnit('', 1);
      expect(modifier.modifyDay(10)).toBe('1年目前期10日目10');
      expect(modifier.modifyDay(11)).toBe('2年目前期1日目11');
    });
    it('If you skip a unit and put it in the position, you should put a space between them.', () => {
      modifier
        .setModifier(dateModifierLabel)
        .updateUnit('春', 0)
        .updateUnit('冬', 3);
      expect(modifier.modifyDay(1)).toBe('1年目春1日目1');
      expect(modifier.modifyDay(11)).toBe('1年目1日目11');
      expect(modifier.modifyDay(21)).toBe('1年目1日目21');
      expect(modifier.modifyDay(31)).toBe('1年目冬1日目31');
      modifier.updateUnit('', 3);
      expect(modifier.modifyDay(1)).toBe('1年目春1日目1');
      expect(modifier.modifyDay(11)).toBe('2年目春1日目11');
      modifier.updateUnit('秋', 2);
      expect(modifier.modifyDay(1)).toBe('1年目春1日目1');
      expect(modifier.modifyDay(11)).toBe('1年目1日目11');
      expect(modifier.modifyDay(21)).toBe('1年目秋1日目21');
    });
    it('should apply four periods in sequence', () => {
      modifier
        .setModifier(dateModifierLabel)
        .updateUnit('春', 0)
        .updateUnit('夏', 1)
        .updateUnit('秋', 2)
        .updateUnit('冬', 3);
      expect(modifier.modifyDay(1)).toBe('1年目春1日目1');
      expect(modifier.modifyDay(11)).toBe('1年目夏1日目11');
      expect(modifier.modifyDay(21)).toBe('1年目秋1日目21');
      expect(modifier.modifyDay(31)).toBe('1年目冬1日目31');
      expect(modifier.modifyDay(41)).toBe('2年目春1日目41');
    });
    it('should apply three periods in sequence', () => {
      modifier
        .setModifier(dateModifierLabel)
        .updateUnit('前期', 0)
        .updateUnit('中期', 1)
        .updateUnit('後期', 2);
      expect(modifier.modifyDay(1)).toBe('1年目前期1日目1');
      expect(modifier.modifyDay(11)).toBe('1年目中期1日目11');
      expect(modifier.modifyDay(21)).toBe('1年目後期1日目21');
      expect(modifier.modifyDay(31)).toBe('2年目前期1日目31');
    });
  });
  describe('toJson', () => {
    it('should return correct JSON object', () => {
      modifier
        .setModifier('フェーズ')
        .updateCycleLength(5)
        .updateUnit('ユニット1', 0)
        .updateUnit('ユニット2', 1);
      const jsonObj = {
        modifier: 'フェーズ',
        cycleLength: 5,
        unit: ['ユニット1', 'ユニット2'],
      };
      expect(modifier).toEqual(
        expect.objectContaining({
          ...jsonObj,
        })
      );
    });
  });
});
