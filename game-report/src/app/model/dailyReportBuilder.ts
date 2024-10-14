import { DailyReport } from "./dailyReport";
import { Settings } from "./settings";
import assert from 'assert'

class DailyReportBuilder {
  /** @param {number} day 日付。reportTitleに書かれるが、dayは編集されない。次のReportを作成するのに使用する。ユニーク。*/
  private day: number;
  /** @param {string} reportTitle タイトル。*/
  private reportTitle: string;
  /** @param {string} report レポート。*/
  private report: string;
  /** @param {string} defaultTitle タイトルのデフォルト値*/
  private defaultTitle: string
  /** @param {?number} previous 前日のレポートの日付。*/
  private previous: number | undefined;
  /** @param {?number} previous 翌日のレポートの日付。*/
  private next: number | undefined;
  constructor(source: DailyReport, settings: Settings);
  constructor(day: number, reportTitle: string, report: string, defaultTitle: string, previous?: number, next?: number);
  constructor(a: DailyReport | number, b: Settings | string, c?: string, d?: string, e?: number, f?: number) {
    if (a instanceof DailyReport && b instanceof Settings) {
      this.day = b.getNextDay(a.day);
      this.reportTitle = b.getModifierDay(a.day);
      this.report = "";
      this.previous = a.day;
      this.next = undefined;
      this.defaultTitle = this.reportTitle;
    } else if (typeof (a) === "number" &&
      typeof (b) === "string" &&
      typeof (c) === "string" &&
      typeof (d) === "string" &&
      (typeof (e) === "number" || typeof (e) === undefined) &&
      (typeof (f) === "number" || typeof (f) === undefined)) {
      this.day = a;
      this.reportTitle = b;
      this.report = c;
      this.defaultTitle = d;
      this.previous = e;
      this.next = f;
    } else {  // タイプガードのため用意してある分岐。実際には使用されない。
      assert(typeof (a), TypeError("DailyReportBuilder can't init"))
      this.day = 1;
      this.reportTitle = "";
      this.report = "";
      this.defaultTitle = "";
      this.previous = undefined;
      this.next = undefined;
    }
  }
  build = (): DailyReport => {
    return new DailyReport(
      this.day,
      this.reportTitle,
      this.report,
      this.defaultTitle,
      this.previous,
      this.next,
    );
  }
}