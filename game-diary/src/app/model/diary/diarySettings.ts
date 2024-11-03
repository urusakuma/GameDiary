import { Constant } from '@/constant';
import type { IDayModifier, IDiarySettings } from './diaryModelInterfaces';
import { inject, injectable } from 'tsyringe';
/** 設定を保存しておくクラス。 */
@injectable()
export class DiarySettings implements IDiarySettings {
  /**
   * @param {string} storageKey ローカルストレージに保存したときのKey。
   * @param {number} version セーブデータを作成したシステムのバージョン。
   * 遊んでいるゲームデータの名前。セーブファイルの名前になる。
   * @param {string} playGamedataName
   * 新規レポートを作成した時に自動で入力されるdayの間隔。
   * 新しいレポートのDayは「参照したレポートのday+dayInterval」となる。
   * @param {number} dayInterval
   * @param {IDayModifier} dayModifier 日の単位。
   */
  constructor(
    @inject('DayModifier') private dayModifier: IDayModifier,
    // TODO :_storageKeyと_versionを後ろにずらす。これらは新しく生成される場合、初期値が使用される方が好都合。コンストラクタにあるのは既に作成済みのデータを読み込むときのため
    // TODO :コンストラクタの宣言を新しく作成する。_storageKeyと_versionの2つは自動生成される方がいい。
    private _storageKey: string = crypto.randomUUID(),
    private _version: number = Constant.CURRENT_VERSION,
    private _playGamedataName: string = Constant.DEFAULT_GAME_DATA_NAME,
    private _dayInterval: number = Constant.DEFAULT_DAY_INTERVAL
  ) {}

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
