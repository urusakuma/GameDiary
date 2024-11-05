import { Constant } from '@/constant';
import { IDiaryEntry, IDiarySettings } from './diaryModelInterfaces';
import { DiarySettings } from './diarySettings';

/** 日ごとの日記*/
export class DiaryEntry implements IDiaryEntry {
  /**
   * @constructor
   * @param {number} _day 日付
   * @param {string} title タイトル
   * @param {string} content 内容
   * @param {?number} _previous 前日のエントリーの日付
   * @param {?number} _next 翌日のエントリーの日付
   */
  constructor(
    private _day: number = 1,
    private title: string = '1' + Constant.DEFAULT_DAY_MODIFIER,
    private content: string = '',
    private _previous: number | undefined = undefined,
    private _next: number | undefined = undefined
  ) {}

  get day() {
    return this._day;
  }

  setTitle(val: string) {
    this.title = val;
  }
  getTitle() {
    return this.title;
  }
  setContent(val: string) {
    this.content = val;
  }
  getContent() {
    return this.content;
  }
  get previous(): number | undefined {
    return this._previous;
  }
  get next(): number | undefined {
    return this._next;
  }
  set previous(val: number) {
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

  isEdited(settings: IDiarySettings): boolean {
    // タイトルが初期状態で、内容が存在しないなら編集されていない
    // タイトルと内容を全て消している場合も編集されていないものとする。
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
