/**ひとつの日記を管理するクラス*/
export interface IDiary {
  /** 設定クラスへの直接アクセス。インスタンスそのものを変更できないようにはしている */
  getSettings(): IDiarySettings;
  /** 日記の最新日 */
  getLastDay(): number;
  /**
   * 新しいエントリーを作成する。
   * @returns {number} 新しく作成したエントリーのday
   */
  createNewEntry(): number;
  /**
   * 指定した日付のエントリーを取得する。
   * @param day 要求するエントリーの日付
   * @returns {IDiaryEntry} 指定されたエントリー
   */
  getEntry(day: number): IDiaryEntry;
  /**
   * 指定したエントリーを削除する。削除に成功した場合trueを返す。初日など削除できない日付も存在する。
   * @param day 削除するエントリーの日付
   * @returns {boolean} 削除に成功したらtrue、失敗したらfalse。
   */
  deleteEntry(day: number): boolean;
}

export type DiaryFactory = (
  diaryEntries: Map<number, IDiaryEntry>,
  settings: IDiarySettings,
  lastDay: number
) => IDiary;
export type NewDiaryFactory = (settings?: IDiarySettings) => IDiary;

export interface IDiaryEntry {
  /** エントリーの日付 */
  get day(): number;
  /** エントリーのタイトル */
  setTitle(val: string): void;
  getTitle(): string;
  /** エントリーの内容 */
  setContent(val: string): void;
  getContent(): string;
  /** 前日のエントリーの日付 */
  set previous(val: number);
  get previous(): number | undefined;
  /** 翌日のエントリーの日付 */
  set next(val: number | undefined);
  get next(): number | undefined;
  /**
   * このエントリーが編集されたならTrue、されていないならFalse
   * @param settings 初期のタイトルを取得するためのSettings
   */
  isEdited(settings: IDiarySettings): boolean;

  /**JSONに変換する。JSON.stringifyで自動的に呼び出される。*/
  toJSON(): object;
}

/** 前日のエントリーと設定クラスから新しいエントリーを組み立てる */
export type UsePreviousDayDiaryEntryFactory = (
  source: IDiaryEntry,
  settings: IDiarySettings
) => IDiaryEntry;

/** 既存の情報から新しいエントリーを組み立てる */
export type UseExistingDataDiaryEntryFactory = (
  day: number,
  title: string,
  content: string,
  previous: number | undefined,
  next: number | undefined
) => IDiaryEntry;

export interface IDiarySettings {
  /** ゲームデータを識別する一意の文字列 */
  get storageKey(): string;
  /** ゲームデータのバージョン */
  get version(): number;
  /** ゲームデータ名を保存する */
  setPlayGameDataName(val: string): void;
  /** ゲームデータ名を取得する */
  getPlayGameDataName(): string;
  /** 日記を書く間隔 */
  updateDayInterval(val: number): void;
  /** 日記を書く間隔を取得する */
  getDayInterval(): number;
  /** 日付をどのように修飾するのかという文字列(日目、$Y年春$N日など)を保存 */
  setModifier(val: string): void;
  /** 日付を修飾する文字列を取得する */
  getModifier(): string;
  /**
   * 日付に対して周期的に付加する単位の設定
   * @param val 付加する単位
   * @param index valを付加する周期の番号。0~3
   */
  updateModifierUnit(val: string, index: number): void;
  /**
   * 日付に対して周期的に付加する単位を取得する。存在しなければ空文字を返す
   * @param index 取得する周期の番号
   */
  getModifierUnit(index: number): string;

  /** 周期的な単位が一度にどれだけ続くのか(15:春1-15,夏1-15など)を保存 */
  updateCycleLength(val: number): void;
  /** 周期的な単位が一度にどれだけ続くのか取得する */
  getCycleLength(): number;

  /**
   * 日付を修飾する周期的な単位を設定する。空文字を設定された場合は取り除く
   * @param val 設定する単位の文字列。
   * @param index unitのどこにsetするか。
   */
  updateModifierUnit(unit: string, i: number): void;

  /**
   * 新しく作成される日付を返す。
   * 0以下を渡されたら1の翌日を返す。小数は切り捨てる。
   * @param day 最新のday
   * @returns 新しく作成するEntryのday
   */
  getNextDay(day: number): number;

  /**
   * 日付を修飾した文字列を取得する。
   * 0以下を渡されたら1の翌日を返す。小数は切り捨てる。
   * @param day 修飾する日付
   * @returns 修飾された日付
   */
  getModifierDay(day: number): string;
}
export type UseExistingDataDiarySettingsFactory = (
  dayModifier: IDayModifier,
  playGameDataName: string,
  dayInterval: number,
  storageKey: string,
  version: number
) => IDiarySettings;

export type NewDiarySettingsFactory = (
  dayModifier: IDayModifier,
  playGameDataName: string,
  dayInterval: number
) => IDiarySettings;

export interface IDayModifier {
  /** 日付をどのように修飾するのかという文字列(日目、$Y年春$N日など) */
  setModifier(val: string): void;
  getModifier(): string;
  /** 周期的な単位が一度にどれだけ続くのか(15:春1-15,夏1-15など) */
  updateCycleLength(val: number): void;
  getCycleLength(): number;

  /**
   * 指定した周期で付加する単位を返却する。存在しない場合は空文字を返却する。
   * @param index 周期の位置
   */
  getUnit(index: number): string;

  /**
   * 日付を修飾する周期的な単位を設定する。空文字を設定された場合は取り除く。
   * @param val 設定する単位の文字列。
   * @param index unitのどこにsetするか。
   */
  updateUnit(val: string, index: number): void;

  /**
   * 受け取った日付に単位を付加して返却する。Constantに強く依存している。
   * - year: naturalDayをcycleLenで割った数
   * - cycle: 周期的に付与される単位
   * - day: naturalDayをcycleLenで割った余り
   * - totalDay: 総経過日数
   * @param naturalDay 修飾したい日付。エントリーから呼び出されたなら総経過日数でもある。
   * @returns 日付の単位を付加した文字列
   */
  modifyDay(naturalDay: number): string;
}

export type DayModifierFactory = (
  modifier: string,
  cycleLength: number,
  ...unit: Array<string>
) => IDayModifier;
