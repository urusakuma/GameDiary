import { DayModifier } from "./dayModifier";
/** 設定を保存しておくクラス。 */
export class Settings {
  /**storageKeyはシリアライズで変更される可能性があるが外部からは編集されたくないので隠ぺいしている。 */
  private readonly _storageKey: string;
  private readonly _version: number;
  private _playGamedataName: string;
  private _dayInterval: number;
  private dayModifier: DayModifier;
  /**
   * @param {string} storageKey ローカルストレージに保存したときのKey。
   * @param {number} version セーブデータを作成したシステムのバージョン。
   * 遊んでいるゲームデータの名前。セーブファイルの名前になる。
   * @param {string} playGamedataName
   * 新規レポートを作成した時に自動で入力されるdayの間隔。
   * 新しいレポートのDayは「参照したレポートのday+dayInterval」となる。
   * @param {number} dayInterval
   * @param {DayModifier} dayModifier 日の単位。
   */
  constructor(
    storageKey: string,
    version: number,
    playGamedataName: string,
    dayInterval: number,
    dayModifier: DayModifier
  ) {
    this._storageKey = storageKey;
    this._version = version;
    this._playGamedataName = playGamedataName;
    this._dayInterval = dayInterval;
    this.dayModifier = dayModifier;
  }

  public get storageKey() {
    return this._storageKey;
  }
  public get version() {
    return this._version;
  }

  public get dayInterval() {
    return this._dayInterval;
  }
  public set dayInterval(i: number) {
    //0以下や整数で表せない値が入力された場合は1が入る。
    const interval = Math.trunc(i);
    if (interval <= 0 || !Number.isSafeInteger(interval)) {
      this._dayInterval = 1;
      return;
    }
    this._dayInterval = interval;
  }

  public get playGamedataName() {
    return this._playGamedataName;
  }
  public set playGamedataName(val: string) {
    this._playGamedataName = val;
  }
  set modifier(val: string) {
    this.dayModifier.modifier = val;
  }
  get modifier() {
    return this.dayModifier.modifier;
  }
  set cycleLength(val: number) {
    this.dayModifier.cycleLength = val;
  }
  get cycleLength() {
    return this.dayModifier.cycleLength;
  }
  /**
   * 日付に対して周期的に付加する単位を設定する。
   * @param unit 単位
   * @param index 付加する場所
   */
  setModifierUnit = (unit: string, i: number): boolean => {
    const index = Math.trunc(i);
    if (index < 0 || 3 < index) {
      return false;
    }
    this.dayModifier.updateUnit(unit, index);
    return true;
  };
  /**
   * 新しく作成するReportの日付を取得する。
   * @param day 最新のday
   * @returns 新しく作成するReportのday
   */
  getNextDay = (day: number): number => {
    return day + this.dayInterval;
  };
  /**
   * 日付を修飾した文字列を取得する。
   * @param day 修飾する日付
   * @returns 修飾された日付
   */
  getModifierDay = (day: number): string => {
    return this.dayModifier.modifyDay(day);
  };
}
