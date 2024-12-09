import { Constant } from '@/constant';
import { DayModifier } from '@/model/diary/dayModifier';
import { IDayModifier } from '@/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';

describe('DayModifier class tests', () => {
  beforeAll(() => {
    container.register<number>('CYCLE_LENGTH', {
      useValue: Constant.DEFAULT_CYCLE_LENGTH,
    });
    container.register<string>('DAY_MODIFIER', {
      useValue: Constant.DEFAULT_DAY_MODIFIER,
    });
    container.register<string>('EMPTY_STRING', { useValue: '' });
    container.register<IDayModifier>('DayModifier', {
      useClass: DayModifier,
    });
  });
  test('init test', () => {
    const modifier = container.resolve<IDayModifier>('DayModifier');
    expect(modifier.getModifier()).toBe(Constant.DEFAULT_DAY_MODIFIER);
    expect(modifier.getCycleLength()).toBe(Constant.DEFAULT_CYCLE_LENGTH);
    for (let i = 0; i < 4; i++) {
      expect(modifier.getUnit(i)).toBe('');
    }
    expect(modifier.modifyDay(1)).toBe('1' + Constant.DEFAULT_DAY_MODIFIER);
  });
  test('set and update function test', () => {
    const modifier = container.resolve<IDayModifier>('DayModifier');
    // 日付修飾は変更できるか
    modifier.setModifier('フェーズ');
    expect(modifier.modifyDay(1)).toBe('1フェーズ');
    // unitが存在する場合も置換文字列が存在しないなら終端に付与されているか
    modifier.updateUnit('Hoge', 1);
    expect(modifier.modifyDay(1)).toBe('1フェーズ');

    // サイクルの長さは1未満にならないか
    modifier.updateCycleLength(0.999);
    expect(modifier.getCycleLength()).toBe(Constant.DEFAULT_CYCLE_LENGTH);
    modifier.updateCycleLength(1);
    expect(modifier.getCycleLength()).toBe(1);
    // サイクルの長さは整数か
    modifier.updateCycleLength(3.333);
    expect(modifier.getCycleLength()).toBe(3);
  });
  test('modifyDay test', () => {
    const modifier = container.resolve<IDayModifier>('DayModifier');
    modifier.setModifier('フェーズ' + Constant.TOTAL_DAYS_PLACEHOLDER);
    expect(modifier.modifyDay(1)).toBe('フェーズ1');
    modifier.setModifier(
      Constant.YEAR_PLACEHOLDER +
        '年目' +
        Constant.CYCLE_PLACEHOLDER +
        Constant.DAY_PLACEHOLDER +
        '日目'
    );
    // 2つの周期単位が適切に付与されるか
    modifier.updateUnit('前期', 0);
    modifier.updateUnit('後期', 1);
    expect(modifier.modifyDay(1)).toBe('1年目前期1日目');
    expect(modifier.modifyDay(10)).toBe('1年目前期10日目');
    expect(modifier.modifyDay(11)).toBe('1年目後期1日目');
    expect(modifier.modifyDay(20)).toBe('1年目後期10日目');
    expect(modifier.modifyDay(21)).toBe('2年目前期1日目');
    expect(modifier.modifyDay(2000)).toBe('100年目後期10日目');
    // 周期単位を最後を取り除いたとき周期が1に戻るか
    modifier.updateUnit('', 1);
    expect(modifier.modifyDay(10)).toBe('1年目前期10日目');
    expect(modifier.modifyDay(11)).toBe('2年目前期1日目');
    // 間を飛ばして4つ目の単位を設定したときに4番目に入るか
    modifier.updateUnit('春', 0);
    modifier.updateUnit('冬', 3);
    expect(modifier.modifyDay(1)).toBe('1年目春1日目');
    expect(modifier.modifyDay(11)).toBe('1年目1日目');
    expect(modifier.modifyDay(21)).toBe('1年目1日目');
    expect(modifier.modifyDay(31)).toBe('1年目冬1日目');
    // 周期が4でも問題なく動作するか
    modifier.updateUnit('夏', 1);
    modifier.updateUnit('秋', 2);
    expect(modifier.modifyDay(1)).toBe('1年目春1日目');
    expect(modifier.modifyDay(11)).toBe('1年目夏1日目');
    expect(modifier.modifyDay(21)).toBe('1年目秋1日目');
    expect(modifier.modifyDay(31)).toBe('1年目冬1日目');
    expect(modifier.modifyDay(41)).toBe('2年目春1日目');
    // 周期が3でも問題なく動作するか
    modifier.updateUnit('前期', 0);
    modifier.updateUnit('中期', 1);
    modifier.updateUnit('後期', 2);
    modifier.updateUnit('', 3);
    expect(modifier.modifyDay(1)).toBe('1年目前期1日目');
    expect(modifier.modifyDay(11)).toBe('1年目中期1日目');
    expect(modifier.modifyDay(21)).toBe('1年目後期1日目');
    expect(modifier.modifyDay(31)).toBe('2年目前期1日目');
    // 周期が4以上なら入力を無視するか
    modifier.updateUnit('虚無期', 5);
    expect(modifier.modifyDay(31)).toBe('2年目前期1日目');
    expect(modifier.modifyDay(41)).toBe('2年目中期1日目');
    expect(modifier.modifyDay(51)).toBe('2年目後期1日目');
  });
});
