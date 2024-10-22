import { DayModifier } from './dayModifier';
import { ISettings } from './diaryInterfaces';
/** 設定を保存しておくクラス。 */
export class Settings implements ISettings {
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
  public set dayInterval(val: number) {
    //0以下や整数で表せない値が入力された場合は1が入る。
    const interval = Math.trunc(val);
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
    //
    const len = Math.trunc(val);
    if (len < 1) {
      return;
    }
    this.dayModifier.cycleLength = len;
  }
  get cycleLength() {
    return this.dayModifier.cycleLength;
  }
  setModifierUnit = (unit: string, index: number): void => {
    const i = Math.trunc(index);
    if (i < 0 || 3 < i) {
      return;
    }
    this.dayModifier.updateUnit(unit, i);
  };
  getNextDay = (day: number): number => {
    return day + this.dayInterval;
  };
  getModifierDay = (day: number): string => {
    return this.dayModifier.modifyDay(day);
  };
}
