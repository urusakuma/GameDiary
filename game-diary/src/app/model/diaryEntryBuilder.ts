import { DiaryEntry } from './diaryEntry';
import { IDiaryEntry, IDiaryEntryBuilder, ISettings } from './diaryInterfaces';
import assert from 'assert';
import { isTypeMatch } from './utils/checkTypeMatch';

export class DiaryEntryBuilder implements IDiaryEntryBuilder {
  private day: number;
  private title: string;
  private content: string;
  private previous: number | undefined;
  private next: number | undefined;
  /**
   * Entryから新しいEntryを作成する。
   * @param {IDiaryEntry} source 新しいEntryの前日となるEntry
   * @param {ISettings} settings Entryを作成するために使用するSettings
   */
  constructor(source: IDiaryEntry, settings: ISettings);
  /**
   * 既に存在するEntryのデータをDiaryEntryにビルドする
   * @param {number} day 日付
   * @param {string} title Entryのタイトル
   * @param {string} content Entryに記述された内容
   * @param {number?} previous 前日のEntryのday
   * @param {number?} next 翌日のEntryのday
   */
  constructor(
    day: number,
    title: string,
    content: string,
    previous?: number,
    next?: number
  );
  constructor(
    a: IDiaryEntry | number,
    b: ISettings | string,
    c?: string,
    d?: number,
    e?: number
  ) {
    if (isTypeMatch(a, 'object') && isTypeMatch(b, 'object')) {
      // constructor1による初期化、objectならa:IDiaryEntry,b:ISettingsと判別できる。
      this.day = b.getNextDay(a.day);
      this.title = b.getModifierDay(a.day);
      this.content = '';
      this.previous = a.day;
      this.next = undefined;
      return;
    }
    // constructor2による初期化
    assert(
      typeof a === 'number' &&
        typeof b === 'string' &&
        typeof c === 'string' &&
        (typeof d === 'number' || typeof d === undefined) &&
        (typeof e === 'number' || typeof e === undefined),
      TypeError("DiaryEntryBuilder can't init")
    );
    this.day = a;
    this.title = b;
    this.content = c;
    this.previous = d;
    this.next = e;
  }
  build = (): IDiaryEntry => {
    return new DiaryEntry(
      this.day,
      this.title,
      this.content,
      this.previous,
      this.next
    );
  };
}
