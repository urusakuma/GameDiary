import { IDiaryEntry } from './diaryInterfaces';
import { Settings } from './settings';

/** 日ごとの日記*/
export class DiaryEntry implements IDiaryEntry {
  private readonly _day: number;
  private _title: string = '';
  private _content: string = '';
  private _previous: number | undefined;
  private _next: number | undefined;
  /**
   * @constructor
   * @param {number} day 日付
   * @param {string} title タイトル
   * @param {string} content 内容
   * @param {?number} previous 前日のエントリーの日付
   * @param {?number} next 翌日のエントリーの日付
   */
  constructor(
    day: number,
    title: string,
    content: string,
    previous?: number,
    next?: number
  ) {
    this._day = day;
    this.title = title;
    this.content = content;
    this.previous = previous;
    this.next = next;
  }

  set title(val: string) {
    this._title = val;
  }
  set content(val: string) {
    this._content = val;
  }
  set previous(val: number | undefined) {
    if (
      (this.day === 1 && val === undefined) || // 初日だけundefinedを許す
      (val !== undefined && this.day > val && val > 0) // 前日は今日より大きくないし1未満にならない
    ) {
      this._previous = val;
    }
  }
  set next(val: number | undefined) {
    // 翌日のエントリーは未作成、もしくは今日より日付が大きい
    if (val === undefined || this.day < val) {
      this._next = val;
    }
  }

  get day() {
    return this._day;
  }
  get title() {
    return this._title;
  }
  get content() {
    return this._content;
  }
  get previous(): number | undefined {
    return this._previous;
  }
  get next(): number | undefined {
    return this._next;
  }
  /**
   * 初期状態から編集されているか判定する。
   * タイトルと内容を全て消している場合も編集されていないものとする。
   * @param {Settings} settings タイトルの初期値を取得するための設定。
   * @return {boolean} 編集されているならtrue、されていないならfalse。*/
  isEdited(settings: Settings): boolean {
    return !(
      this.content === '' &&
      (this.title === '' || this.title === settings.getModifierDay(this.day))
    );
  }

  /**
   * 本来は実装しなくても自動でJSONが出来上がる。
   * previousを取り除くために実装。これで実データで約3%圧縮できる。
   * 日記部分の分量が少なければ最大で12.5%。
   * @returns {object} JSONにシリアライズされるオブジェクト。
   */
  toJSON(): object {
    return {
      day: this.day,
      title: this.title,
      content: this.content,
      next: this.next,
    };
  }
}
