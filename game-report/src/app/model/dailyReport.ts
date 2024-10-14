/** 日ごとのレポート*/
export class DailyReport {
  private readonly _day: number;
  private _reportTitle: string = "";
  private _report: string = "";
  private _previous: number | undefined;
  private _next: number | undefined;
  private readonly defaultTitle: string;
  /**
   * @constructor
   * @param {number} day 日付。
   * @param {string} reportTitle タイトル。
   * @param {string} report レポート。
   * @param {string} defaultTitle 未編集時のタイトル
   * @param {?number} previous 前日のレポートの日付。
   * @param {?number} next 翌日のレポートの日付。*/
  constructor(
    day: number,
    reportTitle: string,
    report: string,
    defaultTitle: string,
    previous?: number,
    next?: number,
  ) {
    this._day = day;
    this.reportTitle = reportTitle;
    this.report = report;
    this.defaultTitle = defaultTitle;
    this.previous = previous;
    this.next = next;
  }

  set reportTitle(val: string) { this._reportTitle = val }
  set report(val: string) { this._report = val }
  set previous(val: number | undefined) {
    if ((this.day === 1 && val === undefined) || // 初日だけundefinedを許す
      (val !== undefined && this.day > val && val > 0)) { // 前日が1未満になることはない
      this._previous = val
    }
  }
  set next(val: number | undefined) {
    if (val === undefined || this.day < val) { // 翌日のレポートは未作成か今日より日付が大きい
      this._next = val
    }
  }

  get day() { return this._day }
  get reportTitle() { return this._reportTitle }
  get report() { return this._report }
  get previous(): number | undefined { return this._previous }
  get next(): number | undefined { return this._next }
  /**
   * 初期状態から編集されているか判定する。
   * タイトルとレポートを全て消している場合も編集されていないものとする。
   * @return {boolean} 編集されているならtrue、されていないならfalse。*/
  isEdited = (): boolean => {
    return !(
      this.report === "" &&
      (this.reportTitle === "" || this.reportTitle === this.defaultTitle)
    );
  };
}