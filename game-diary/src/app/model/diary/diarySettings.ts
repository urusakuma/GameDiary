import { Constant } from '@/constant';
import type { IDayModifier, IDiarySettings } from './diaryModelInterfaces';
import { inject, injectable } from 'tsyringe';
/** 設定を保存しておくクラス。 */
@injectable()
export class DiarySettings implements IDiarySettings {
  constructor(
    dayModifier: IDayModifier,
    playGameDataName: string,
    dayInterval: number
  );
  constructor(
    dayModifier: IDayModifier,
    playGameDataName: string,
    dayInterval: number,
    _storageKey: string,
    _version: number
  );
  /**
   * @param {string} storageKey ローカルストレージに保存したときのKey。
   * @param {number} version セーブデータを作成したシステムのバージョン。
   * 遊んでいるゲームデータの名前。セーブファイルの名前になる。
   * @param {string} playGameDataName
   * 新規レポートを作成した時に自動で入力されるdayの間隔。
   * 新しいレポートのDayは「参照したレポートのday+dayInterval」となる。
   * @param {number} dayInterval
   * @param {IDayModifier} dayModifier 日の単位。
   */
  constructor(
    @inject('DayModifier') private dayModifier: IDayModifier,
    private playGameDataName: string = Constant.DEFAULT_GAME_DATA_NAME,
    private dayInterval: number = Constant.DEFAULT_DAY_INTERVAL,
    private _storageKey: string = crypto.randomUUID(),
    private _version: number = Constant.CURRENT_VERSION
  ) {}

  get storageKey() {
    return this._storageKey;
  }
  get version() {
    return this._version;
  }

  getDayInterval() {
    return this.dayInterval;
  }
  updateDayInterval(val: number): void {
    //0以下や整数で表せない値が入力された場合は1が入る。
    const interval = Math.trunc(val);
    if (interval <= 0 || !Number.isSafeInteger(interval)) {
      this.dayInterval = 1;
      return;
    }
    this.dayInterval = interval;
  }

  setPlayGameDataName(val: string): void {
    this.playGameDataName = val;
  }
  getPlayGameDataName(): string {
    return this.playGameDataName;
  }
  setModifier(val: string): void {
    this.dayModifier.setModifier(val);
  }
  getModifier(): string {
    return this.dayModifier.getModifier();
  }
  updateCycleLength(val: number): void {
    this.dayModifier.updateCycleLength(val);
  }
  getCycleLength(): number {
    return this.dayModifier.getCycleLength();
  }
  updateModifierUnit(unit: string, index: number): void {
    this.dayModifier.updateUnit(unit, index);
  }
  getNextDay(day: number): number {
    return day + this.dayInterval;
  }
  getModifierDay(day: number): string {
    return this.dayModifier.modifyDay(day);
  }
}
