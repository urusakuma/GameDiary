import { KeyNotFoundError } from 'src/lib/error';
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
   * @param {Map<number,IDiaryEntry>} diaryEntries エントリーの連想配列
   * @param {IDiarySettings} settings 設定クラス
   * @param {number} lastDay エントリーの最終日
   */
  constructor(
    @inject('UsePreviousDayDiaryEntryFactory')
    private builder: UsePreviousDayDiaryEntryFactory,
    @inject('DiaryEntriesContainingFirstDay')
    private diaryEntries: Map<number, IDiaryEntry>,
    @inject('IDiarySettings')
    private settings: IDiarySettings,
    @inject('FirstDay')
    private lastDay: number = 1
  ) {
    assert(diaryEntries.size !== 0, `not exists any entry`);
    assert(diaryEntries.get(lastDay) !== undefined, `not exists ${lastDay}`);
  }
  getSettings() {
    return this.settings;
  }
  getLastDay(): number {
    return this.lastDay;
  }
  /**
   * 新しいDailyEntryを作成する。
   * @returns 新しいIDiaryEntryのday
   */
  createNewEntry(): number {
    const lastDiary = this.diaryEntries.get(this.lastDay);
    assert(
      lastDiary !== undefined,
      new KeyNotFoundError(`not exists day=${this.lastDay}`)
    );
    const newDiary = this.builder(lastDiary, this.settings);
    this.diaryEntries.set(newDiary.day, newDiary);
    this.getEntry(this.lastDay).next = newDiary.day;
    this.lastDay = newDiary.day;
    return newDiary.day;
  }

  /**
   * 指定した日付のエントリーを取得する。
   * @param {number} day 取得したい日付。
   * @return {IDiaryEntry} 取得するIDiaryEntry。存在しない場合はKeyNotFoundErrorを返す。
   * @throws {KeyNotFoundError} その日付のエントリーは存在しない*/
  getEntry(day: number): IDiaryEntry {
    const entry = this.diaryEntries.get(day);
    assert(
      entry !== undefined,
      new KeyNotFoundError(`not exists day=${day} entry`)
    );
    return entry;
  }

  /**
   * 指定したインデックスのエントリーを削除する。
   * エントリーの前後が存在するならそれを直接つなげる。
   * 前後のエントリーが自身を参照しているなら、その参照を削除する。
   * @param {number} day 削除するエントリーの日付
   * @returns {boolean} 削除したならtrue、しなかったならfalse。 */
  deleteEntry(day: number): boolean {
    const entry = this.getEntry(day);
    const previous =
      entry.previous !== undefined ? this.getEntry(entry.previous) : undefined;
    const next =
      entry.next !== undefined ? this.getEntry(entry.next) : undefined;
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
    return this.diaryEntries.delete(day);
  }
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * diaryEntriesはMapなのでArrayに変換しないとシリアライズされないため実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON(): object {
    return {
      settings: this.settings,
      diaryEntries: this.diaryEntries.values().toArray(),
      lastDay: this.lastDay,
    };
  }
}
