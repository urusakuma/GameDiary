import { KeyAlreadyExistsError, KeyNotFoundError } from "../error";
import { Settings } from "./settings";
import { DailyReport } from "./dailyReport";
import { DailyReportBuilder } from "./dailyReportBuilder";
import assert from "assert";

/**レポートの管理を行うクラス。*/
export class Reports {
  /** @param {Map<number,DailyReport>} dailyReports レポートの連想配列。*/
  private dailyReports: Map<number, DailyReport>;
  /** @param {Settings} _settings 設定。*/
  private _settings: Settings;
  /** 最新のレポートの日付 */
  private _lastDay: number;
  /**
   * @param {Map<number,DailyReport>} dailyReports レポートの連想配列
   * @param {Settings} settings 設定クラス
   * @param {number} lastDay レポートの最終日
   */
  constructor(
    dailyReports: Map<number, DailyReport>,
    settings: Settings,
    lastDay: number
  ) {
    assert(dailyReports.size !== 0, `not exists any report`);
    assert(dailyReports.get(lastDay) !== undefined, `not exists ${lastDay}`);
    this.dailyReports = dailyReports;
    this._settings = settings;
    this._lastDay = lastDay;
  }
  get settings() {
    return this._settings;
  }
  public get lastDay(): number {
    return this._lastDay;
  }
  private set lastDay(val: number) {
    this._lastDay = val;
  }

  createNewReport(): number {
    const lastReport = this.dailyReports.get(this.lastDay);
    assert(
      lastReport !== undefined,
      new KeyNotFoundError(`not exists day=${this._lastDay}`)
    );
    const newReport = new DailyReportBuilder(lastReport, this.settings).build();
    this.dailyReports.set(newReport.day, newReport);
    return newReport.day;
  }
  /**
   * レポートを連想配列に追加する。
   * @param {DailyReport} report 追加するレポート
   * @throws {ArgumentError} すでに存在する日付を追加しようとした。*/
  add = (report: DailyReport): void => {
    assert(
      !this.dailyReports.has(report.day),
      new KeyAlreadyExistsError(`already exists day=${report.day}`)
    );
    this.dailyReports.set(report.day, report);
    // dayがlastDayより大きければlastDayを更新。
    this.lastDay = this.lastDay > report.day ? this.lastDay : report.day;
  };

  /**
   * 指定した日付のレポートを取得する。
   * @param {number} day 取得したい日付。
   * @return {DailyReport} 取得するDailyReport。存在しない場合はKeyNotFoundErrorを返す。
   * @throws {KeyNotFoundError} その日付のレポートは存在しない*/
  get = (day: number): DailyReport => {
    const report = this.dailyReports.get(day);
    assert(
      report !== undefined,
      new KeyNotFoundError(`not exists day=${day} report`)
    );
    return report;
  };

  /**
   * 指定したインデックスのレポートを削除する。
   * レポートの前後が存在するならそれを直接つなげる。前後のレポートが自身を参照しているなら、その参照を削除する。
   * @param {number} day 削除するレポートの日付
   * @returns {boolean} 削除したならtrue、しなかったならfalse。 */
  delete = (day: number): boolean => {
    const report = this.get(day);
    const previous =
      report.previous !== undefined ? this.get(report.previous) : undefined;
    const next = report.next !== undefined ? this.get(report.next) : undefined;
    if (this.lastDay === day && previous !== undefined) {
      // 削除する日が最新日と同じかつ前日が存在するなら、前日から削除日を消し、lastDayを前日に置き換える。
      previous.next = undefined;
      this.lastDay = day;
    } else if (previous != undefined && next != undefined) {
      // 前後にレポートが存在するならそれらを繋げる。
      previous.next = next.day;
      next.previous = previous.day;
    } else if (previous === undefined && next !== undefined) {
      // 削除する日が最も古い日かつ翌日が存在するなら翌日から削除日を消す。
      next.previous = undefined;
    }
    return this.dailyReports.delete(day);
  };
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * DailyReportsはMapなのでArrayに変換しないとシリアライズされないので実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON = (): object => {
    return {
      settings: this._settings,
      dailyReports: [...this.dailyReports],
      lastDay: this._lastDay,
    };
  };
}
