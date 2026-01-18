import DiarySettingsConstant from '@/diarySettingsConstant';
import { IDiaryEntry, IDiarySettings } from './diaryModelInterfaces';
import { inject, injectable } from 'tsyringe';

/** 日ごとの日記*/
@injectable()
export default class DiaryEntry implements IDiaryEntry {
  /**
   * @constructor
   * @param {number} _day 日付
   * @param {string} title タイトル
   * @param {string} content 内容
   * @param {?number} _previous 前日のエントリーの日付
   * @param {?number} _next 翌日のエントリーの日付
   */
  constructor(
    @inject('FIRST_DAY') private _day: number,
    @inject('DEFAULT_TITLE')
    private title: string,
    @inject('EMPTY_STRING')
    private content: string,
    @inject('UNDEFINED')
    private _previous: number | undefined,
    @inject('UNDEFINED')
    private _next: number | undefined
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
    const day = Math.trunc(val);
    // 前日は今日より小さいし、1未満にならない
    if (this.day > day && day >= 1) {
      this._previous = day;
    }
  }
  set next(val: number | undefined) {
    if (val === undefined) {
      // 翌日のエントリーは存在しなくなる
      this._next = val;
      return;
    }
    const day = Math.trunc(val);
    // 翌日は常に今日より大きい
    if (this.day < day) {
      this._next = day;
    }
  }

  isEdited(settings: IDiarySettings): boolean {
    // タイトルが初期状態で、内容が存在しないなら編集されていない
    // タイトルと内容を全て消している場合も編集されていない
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
