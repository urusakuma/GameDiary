import { Constant } from '../constant';
import { IDayModifier } from './diaryInterfaces';

/**日の単位。ゲームによって日だったりサイクルだったりする。 */
export class DayModifier implements IDayModifier {
  private _modifier: string;
  private _cycleLength: number;
  private _unit: Array<string>;
  /**
   * 日付を修飾する文字列。nサイクル、$N日目$Y年$C$D日(100日目4年春1日)など。
   * @param {string} modifier
   * @param {number?} cycleLength 単位が変化する周期。
   * @param {Array<string>} unit 日付に対して周期的に付加される単位。
   */
  constructor(modifier: string);
  constructor(modifier: string, cycleLength: number, ...unit: Array<string>);
  constructor(modifier: string, cycleLength?: number, ...unit: Array<string>) {
    this._modifier = modifier;
    this._cycleLength = cycleLength ?? 10;
    this._unit = [];
    for (let i = 0; i < unit.length; i++) {
      if (unit[i] === '') {
        continue;
      }
      this.updateUnit(unit[i], i);
    }
  }
  public get modifier(): string {
    return this._modifier;
  }
  public set modifier(val: string) {
    this._modifier = val;
  }
  public get cycleLength(): number {
    return this._cycleLength;
  }
  public set cycleLength(val: number) {
    const cycLen = Math.trunc(val);
    if (cycLen <= 0) {
      return;
    }
    this._cycleLength = cycLen;
  }
  public getUnit = (index: number): string => {
    if (index >= this._unit.length) {
      return '';
    }
    return this._unit[index];
  };
  updateUnit = (val: string, index: number) => {
    /**unit.lengthが単位の個数であることを維持すること。*/

    // indexがunit.lengthを超える場合RangeErrorを発生させるので""で埋める
    for (let i = index - this._unit.length; i > 0; i--) {
      this._unit.push('');
    }
    // ArrayのRangeが足りていることを保証されたのでそこに代入。
    this._unit[index] = val;

    // unitを後ろから探索し空文字なら取り除くことにより、unit.lengthは常に単位の個数となる。
    for (let i = this._unit.length - 1; i > 0; i--) {
      if (this._unit[i] !== '') {
        break;
      }
      this._unit.pop();
    }
  };

  modifyDay = (naturalDay: number): string => {
    const unitLen = this._unit.length;
    // unitが存在しない場合、置換文字列が存在するなら置き換えて(フェーズ$Nなど)、
    // 存在しないなら終端に付与して(n日目など)返却する。
    if (unitLen === 0) {
      if (this.modifier.includes(Constant.TOTAL_DAYS_PLACEHOLDER))
        return this.modifier.replace(
          Constant.TOTAL_DAYS_PLACEHOLDER,
          String(naturalDay)
        );
      return String(naturalDay) + this.modifier;
    }

    // 一周の最終日はcycleLen*unitLen日目。
    // 総日数をcycleLen*unitLenで割ることで経過周期を求める。
    // 数えるのは0年目からではなく、1年目からなので最後に+1。
    const year = String(
      Math.trunc(naturalDay / (this._cycleLength * unitLen)) + 1
    );

    // その周期の日付を求めるために総日数をcycleLenで割った剰余を求める。
    // 剰余が0であればcycleLen日目なので代わりにcycleLenを代入。
    const d = naturalDay % this._cycleLength;
    const day = d !== 0 ? String(d) : String(this._cycleLength);

    // その周期で付加する単位を求める。
    // 総日数が0からではなく1から始まるため周期が1日ズレる。ので総日数を-1。
    // その後cycleLenで割り、周期が変わった回数を求める
    // それをunitLenで割った剰余にして付加する単位を求める。
    const c = Math.trunc((naturalDay - 1) / this._cycleLength);
    const cycle = this.getUnit(c % unitLen);

    //全ての置換文字列を置き換えて返却。
    return this.modifier
      .replace(Constant.YEAR_PLACEHOLDER, year)
      .replace(Constant.CYCLE_PLACEHOLDER, cycle)
      .replace(Constant.DAY_PLACEHOLDER, day)
      .replace(Constant.TOTAL_DAYS_PLACEHOLDER, String(naturalDay));
  };
}
