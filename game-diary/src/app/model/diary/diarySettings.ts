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
   * @param {string} playGameDataName
   * 新規レポートを作成した時に自動で入力されるdayの間隔。
   * 新しいレポートのDayは「参照したレポートのday+dayInterval」となる。
   * @param {number} dayInterval
   * @param {IDayModifier} dayModifier 日の単位。
   */
  constructor(
    @inject('IDayModifier') private dayModifier: IDayModifier,
    @inject('GAME_DATA_NAME')
    private playGameDataName: string,
    @inject('DAY_INTERVAL')
    private dayInterval: number,
    @inject('STORAGE_KEY') private _storageKey: string,
    @inject('VERSION') private _version: number
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
  getModifierUnit(index: number): string {
    return this.dayModifier.getUnit(index);
  }
  getNextDay(day: number): number {
    const d = Math.trunc(day);
    if (d < 1) {
      return this.dayInterval + 1;
    }
    return d + this.dayInterval;
  }
  getModifierDay(day: number): string {
    const d = Math.trunc(day);
    return this.dayModifier.modifyDay(d > 1 ? d : 1);
  }
}
