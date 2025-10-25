import { inject, injectable } from 'tsyringe';
import DairySettingsConstant from '../../dairySettingsConstant';
import { IDayModifier } from './diaryModelInterfaces';

/**日の単位。ゲームによって日だったりサイクルだったりする。 */
@injectable()
export default class DayModifier implements IDayModifier {
  private unit: Array<string>;
  /**
   * 日付を修飾する文字列。nサイクル、$N日目$Y年$C$D日(100日目4年春1日)など。
   * @param {string} modifier
   * @param {number?} cycleLength 単位が変化する周期。
   * @param {Array<string>} unit 日付に対して周期的に付加される単位。unit.lengthが単位の個数でもある。
   */
  constructor(
    @inject('DAY_MODIFIER')
    private modifier: string,
    @inject('CYCLE_LENGTH')
    private cycleLength: number,
    @inject('EMPTY_STRING') ...unit: Array<string>
  ) {
    this.unit = [...unit];
    this.unit = this.unit.slice(0, 4);
    this.maintainValidUnitLength();
  }
  setModifier(val: string): void {
    this.modifier = val;
  }
  getModifier(): string {
    return this.modifier;
  }
  updateCycleLength(val: number): void {
    const cycLen = Math.trunc(val);
    if (cycLen < 1) {
      return;
    }
    this.cycleLength = cycLen;
  }
  getCycleLength(): number {
    return this.cycleLength;
  }
  getUnit(index: number): string {
    const i = Math.trunc(index);
    if (i >= this.unit.length || i < 0) {
      return '';
    }
    return this.unit[i];
  }
  updateUnit(val: string, index: number): void {
    const num = Math.trunc(index);
    if (num < 0 || 3 < num) {
      return;
    }

    // indexがunit.lengthを超える場合RangeErrorを発生させるので""で埋める
    const missingElements = num - this.unit.length;
    if (missingElements > 0) {
      this.unit.push(...Array(missingElements).fill(''));
    }
    // ArrayのRangeが足りていることを保証されたのでそこに代入。
    this.unit[num] = val;

    // unitを後ろから探索し空文字なら取り除くことにより、unit.lengthは常に単位の個数となる。
    this.maintainValidUnitLength();
  }
  /** unitの末尾が空文字でないことを維持することで、unit.lengthが単位の個数であることを維持する。*/
  private maintainValidUnitLength(): void {
    while (this.unit.length > 0 && this.unit[this.unit.length - 1] === '') {
      this.unit.pop();
    }
  }

  modifyDay(nDay: number): string {
    const naturalDay = Math.trunc(nDay);
    const unitLen = this.unit.length;
    // unitが存在しない場合、置換文字列が存在するなら置き換えて(フェーズ$Nなど)、
    // 存在しないなら終端に付与して(n日目など)返却する。
    if (unitLen === 0) {
      if (this.modifier.includes(DairySettingsConstant.TOTAL_DAYS_PLACEHOLDER))
        return this.modifier.replace(
          DairySettingsConstant.TOTAL_DAYS_PLACEHOLDER,
          String(naturalDay)
        );
      return String(naturalDay) + this.modifier;
    }
    // unitが存在するが置換文字列が存在しない場合は終端に付与して返却する。
    if (
      !(
        this.modifier.includes(DairySettingsConstant.TOTAL_DAYS_PLACEHOLDER) ||
        this.modifier.includes(DairySettingsConstant.YEAR_PLACEHOLDER) ||
        this.modifier.includes(DairySettingsConstant.CYCLE_PLACEHOLDER) ||
        this.modifier.includes(DairySettingsConstant.DAY_PLACEHOLDER)
      )
    ) {
      return String(naturalDay) + this.modifier;
    }

    // 一周の最終日はcycleLen*unitLen日目。
    const cyclePeriod = this.cycleLength * unitLen;

    // 総日数をcyclePeriodで割ることで経過周期を求める。
    // naturalDayが1から始まってしまうと切り替わりで数字が合わなくなるので0から始めるために-1。
    // 数えるのは0年目からではなく、1年目からなので最後に+1。
    const year = String(Math.trunc((naturalDay - 1) / cyclePeriod) + 1);

    // その周期の日付を求めるために総日数をcycleLenで割った剰余を求める。
    // 剰余が0であればcycleLen日目なので代わりにcycleLenを代入。
    const dayWithinCycle = naturalDay % this.cycleLength;
    const dayNumber = dayWithinCycle !== 0 ? dayWithinCycle : this.cycleLength;
    const day = String(dayNumber);

    // その周期で付加する単位を求める。
    // 総日数が0からではなく1から始まるため周期が1日ズレる。ので総日数を-1。
    // その後cycleLenで割り、周期が変わった回数を求める
    // それをunitLenで割った剰余にして付加する単位を求める。
    const c = Math.trunc((naturalDay - 1) / this.cycleLength);
    const cycle = this.getUnit(c % unitLen);

    //全ての置換文字列を置き換えて返却。
    return this.modifier
      .replace(DairySettingsConstant.YEAR_PLACEHOLDER, year)
      .replace(DairySettingsConstant.CYCLE_PLACEHOLDER, cycle)
      .replace(DairySettingsConstant.DAY_PLACEHOLDER, day)
      .replace(
        DairySettingsConstant.TOTAL_DAYS_PLACEHOLDER,
        String(naturalDay)
      );
  }
}
