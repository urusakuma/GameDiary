import { DailyReport } from './dailyReport';
import { Settings } from './settings';
import assert from 'assert';

export class DailyReportBuilder {
  /** @param {number} day 日付。reportTitleに書かれるが、dayは編集されない。次のReportを作成するのに使用する。ユニーク。*/
  private day: number;
  /** @param {string} reportTitle タイトル。*/
  private reportTitle: string;
  /** @param {string} report レポート。*/
  private report: string;
  /** @param {?number} previous 前日のレポートの日付。*/
  private previous: number | undefined;
  /** @param {?number} previous 翌日のレポートの日付。*/
  private next: number | undefined;

  constructor(source: DailyReport, settings: Settings);
  constructor(
    day: number,
    reportTitle: string,
    report: string,
    previous?: number,
    next?: number
  );
  constructor(
    a: DailyReport | number,
    b: Settings | string,
    c?: string,
    d?: number,
    e?: number
  ) {
    if (a instanceof DailyReport && b instanceof Settings) {
      // constructor1による初期化
      this.day = b.getNextDay(a.day);
      this.reportTitle = b.getModifierDay(a.day);
      this.report = '';
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
      TypeError("DailyReportBuilder can't init")
    );
    this.day = a;
    this.reportTitle = b;
    this.report = c;
    this.previous = d;
    this.next = e;
  }
  build = (): DailyReport => {
    return new DailyReport(
      this.day,
      this.reportTitle,
      this.report,
      this.previous,
      this.next
    );
  };
}
