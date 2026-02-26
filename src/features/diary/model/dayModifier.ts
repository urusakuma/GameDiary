import { inject, injectable } from 'tsyringe';
import type { IDayModifier, Placeholders } from './diaryModelInterfaces';
/**日の単位。ゲームによって日だったりサイクルだったりする。 */
@injectable()
export default class DayModifier implements IDayModifier {
  private unit: Array<string>;
  /**
   * 日付を修飾する文字列。nサイクル、$N日目$Y年$C$D日(100日目4年春1日)など。
   * @param {string} modifier
   * @param {number} cycleLength 単位が変化する周期。
   * @param {Placeholders} placeholders 置換文字列。modifierに含まれる$Nや$Yなどの文字列を置換するためのもの。
   * @param {Array<string>} unit 日付に対して周期的に付加される単位。unit.lengthが単位の個数でもある。
   */
  constructor(
    @inject('DAY_MODIFIER')
    private modifier: string,
    @inject('CYCLE_LENGTH')
    private cycleLength: number,
    @inject('Placeholders') private readonly placeholders: Placeholders,
    @inject('EMPTY_STRING') ...unit: Array<string>
  ) {
    this.unit = [...unit];
    this.unit = this.unit.slice(0, 4);
    this.maintainValidUnitLength();
  }
  setModifier(val: string): void {
    if (val === '') {
      return;
    }
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

  modifyDay(originalDay: number): string {
    const naturalDay = Math.trunc(originalDay);
    const unitLen = this.unit.length;

    // 置換文字列が存在しない場合は終端に付与して返却する。
    if (
      !(
        this.modifier.includes(this.placeholders.totalDay) ||
        this.modifier.includes(this.placeholders.year) ||
        this.modifier.includes(this.placeholders.cycle) ||
        this.modifier.includes(this.placeholders.day)
      )
    ) {
      return String(naturalDay) + this.modifier;
    }

    // unitが存在しない場合、TOTAL_DAYSの置換文字列だけを置き換えて返却する
    if (unitLen === 0) {
      return this.modifier.replace(
        this.placeholders.totalDay,
        String(naturalDay)
      );
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
      .replace(this.placeholders.year, year)
      .replace(this.placeholders.cycle, cycle)
      .replace(this.placeholders.day, day)
      .replace(this.placeholders.totalDay, String(naturalDay));
  }
  /**
   * オブジェクトをJSON文字列に変換する。
   * 実装しなくてもJSONに変換されるが、placeholdersを除外するために実装する。
   * @returns {string} JSON文字列
   */
  toJson(): string {
    return JSON.stringify({
      modifier: this.modifier,
      cycleLength: this.cycleLength,
      unit: this.unit,
    });
  }
}
