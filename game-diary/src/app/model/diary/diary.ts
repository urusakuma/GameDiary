import { KeyAlreadyExistsError, KeyNotFoundError } from '../../error';
import { DiaryEntry } from './diaryEntry';
import assert from 'assert';
import type {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
  UsePreviousDayDiaryEntryFactory,
} from './diaryModelInterfaces';
import { inject, injectable } from 'tsyringe';

/**日記の管理を行うクラス。*/
@injectable()
export class Diary implements IDiary {
  /**
   * @param {Map<number,IDiaryEntry>} diaryEntrys エントリーの連想配列
   * @param {IDiarySettings} _settings 設定クラス
   * @param {number} lastDay エントリーの最終日
   */
  constructor(
    @inject('UsePreviousDayDiaryEntryBuilder')
    private builder: UsePreviousDayDiaryEntryFactory,
    private diaryEntrys: Map<number, IDiaryEntry>,
    private _settings: IDiarySettings,
    private _lastDay: number = 1
  ) {
    assert(diaryEntrys.size !== 0, `not exists any entry`);
    assert(diaryEntrys.get(_lastDay) !== undefined, `not exists ${_lastDay}`);
  }
  get settings() {
    return this._settings;
  }
  public get lastDay(): number {
    return this._lastDay;
  }
  /** このクラス内でlastDayとして呼び出すためのセッター */
  private set lastDay(val: number) {
    this._lastDay = val;
  }
  /**
   * 新しいDailyEntryを作成する。
   * @returns 新しいIDiaryEntryのday
   */
  createNewEntry = (): number => {
    const lastDiary = this.diaryEntrys.get(this.lastDay);
    assert(
      lastDiary !== undefined,
      new KeyNotFoundError(`not exists day=${this._lastDay}`)
    );
    const newDiary = this.builder(lastDiary, this.settings);
    this.diaryEntrys.set(newDiary.day, newDiary);
    return newDiary.day;
  };

  /**
   * エントリーを連想配列に追加する。
   * @param {DiaryEntry} entry 追加するエントリー
   * @throws {KeyAlreadyExistsError} すでに存在する日付を追加しようとした。*/
  add = (entry: DiaryEntry): void => {
    assert(
      !this.diaryEntrys.has(entry.day),
      new KeyAlreadyExistsError(`already exists day=${entry.day}`)
    );
    this.diaryEntrys.set(entry.day, entry);
    // dayがlastDayより大きければlastDayを更新。
    this.lastDay = this.lastDay > entry.day ? this.lastDay : entry.day;
  };

  /**
   * 指定した日付のエントリーを取得する。
   * @param {number} day 取得したい日付。
   * @return {IDiaryEntry} 取得するIDiaryEntry。存在しない場合はKeyNotFoundErrorを返す。
   * @throws {KeyNotFoundError} その日付のエントリーは存在しない*/
  get = (day: number): IDiaryEntry => {
    const entry = this.diaryEntrys.get(day);
    assert(
      entry !== undefined,
      new KeyNotFoundError(`not exists day=${day} entry`)
    );
    return entry;
  };

  /**
   * 指定したインデックスのエントリーを削除する。
   * エントリーの前後が存在するならそれを直接つなげる。
   * 前後のエントリーが自身を参照しているなら、その参照を削除する。
   * @param {number} day 削除するエントリーの日付
   * @returns {boolean} 削除したならtrue、しなかったならfalse。 */
  delete = (day: number): boolean => {
    const entry = this.get(day);
    const previous =
      entry.previous !== undefined ? this.get(entry.previous) : undefined;
    const next = entry.next !== undefined ? this.get(entry.next) : undefined;
    if (this.lastDay === day && previous !== undefined) {
      // 削除する日が最新日と同じかつ前日が存在するなら、前日から削除日を消し、lastDayを前日に置き換える。
      previous.next = undefined;
      this.lastDay = previous.day;
    } else if (previous != undefined && next != undefined) {
      // 前後にエントリーが存在するならそれらを繋げる。
      previous.next = next.day;
      next.previous = previous.day;
    } else {
      //最新日でなく前後にエントリーもないなら、それは初日なので削除しない。
      return false;
    }
    return this.diaryEntrys.delete(day);
  };
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * diaryEntrysはMapなのでArrayに変換しないとシリアライズされないため実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON = (): object => {
    return {
      settings: this._settings,
      diaryEntrys: [...this.diaryEntrys],
      lastDay: this._lastDay,
    };
  };
}
