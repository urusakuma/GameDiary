export interface IDiaryLoader {
  /**
   * 指定したGameDataNameのDiaryを取得する。特に指定がないならカレントを指定されたものとする。
   * @param {string?} key 取得するDiaryのストレージキー、指定していないならカレントを指定されたものとする。
   * @returns {IDiary} 取得するIDiary
   */
  loadDiaryAsCurrent(key?: string): IDiary;
  /**
   * 新しいDiaryを作成する関数。作成されたDiaryを現在のDiaryにする。
   * @returns 新しく作成されたDiary
   */
  createNewDiary(): IDiary;
}
export interface IDiaryKeyMapper {
  /** 保存されたゲームデータの数を返す */
  get length(): number;
  /**
   * 保存されているゲーム名の配列を返す。
   * @returns {Array<string>} ゲーム名の配列
   */
  collectGameDataNames(): Array<string>;
  /**
   * 新しいゲームデータ名を保存する。
   * @param key ゲームデータ名を引き出すストレージキー
   * @param name ゲームデータ名
   */
  setGameDataName(key: string, name: string): void;
  /**
   * ゲームデータ名からストレージキーを探す。
   * @param name ストレージキーを調べるゲームデータ名
   */
  getGameDataKey(name: string): string | null;
  /**
   * 現在操作しているゲームデータのストレージキーを返す。
   * 存在しない場合はnullを返す。
   * @returns 現在操作しているゲームデータのストレージキー
   */
  getCurrentGameDataKey(): string | null;
  /**
   * 現在操作しているゲームデータのストレージキーを変更する。
   * @param key 新しく操作するゲームデータのストレージキー
   */
  setCurrentGameDataKey(key: string): void;
}
export interface IDiary {
  /** 設定クラスへの直接アクセス。インスタンスそのものを変更できないようにはしている */
  get settings(): IDiarySettings;
  /** 日記の最新日 */
  get lastDay(): number;
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
  get(day: number): IDiaryEntry;
  /**
   * 指定したエントリーを削除する。削除に成功した場合trueを返す。初日など削除できない日付も存在する。
   * @param day 削除するエントリーの日付
   * @returns {boolean} 削除に成功したらtrue、失敗したらfalse。
   */
  delete(day: number): boolean;
}

export type DiaryFactory = (
  diaryEntrys: Map<number, IDiaryEntry>,
  settings: IDiarySettings,
  lastDay: number
) => IDiary;
export type NewDiaryFactory = (settings?: IDiarySettings) => IDiary;

export interface IDiaryEntry {
  /** レポートの日付 */
  get day(): number;
  /** レポートのタイトル */
  set title(val: string);
  get title(): string;
  /** レポートの内容 */
  set content(val: string);
  get content(): string;
  /** 前日のレポートの日付 */
  set previous(val: number | undefined);
  get previous(): number | undefined;
  /** 翌日のレポートの日付 */
  set next(val: number | undefined);
  get next(): number | undefined;
  /**
   * このレポートが編集されたならTrue、されていないならFalse
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
  /** ゲームデータ名 */
  get playGamedataName(): string;
  set playGamedataName(val: string);
  /** レポートを取る間隔 */
  get dayInterval(): number;
  set dayInterval(val: number);
  /** 日付をどのように修飾するのかという文字列(日目、$Y年春$N日など) */
  get modifier(): string;
  set modifier(val: string);
  /** 周期的な単位が一度にどれだけ続くのか(15:春1-15,夏1-15など) */
  get cycleLength(): number;
  set cycleLength(val: number);

  /**
   * 日付を修飾する周期的な単位を設定する。空文字を設定された場合は取り除く。
   * @param val 設定する単位の文字列。
   * @param index unitのどこにsetするか。
   */
  setModifierUnit(unit: string, i: number): void;

  /**
   * 新しく作成される日付を返す。
   * @param day最新のday
   * @returns 新しく作成するEntryのday
   */
  getNextDay(day: number): number;

  /**
   * 日付を修飾した文字列を取得する。
   * @param day 修飾する日付
   * @returns 修飾された日付
   */
  getModifierDay(day: number): string;
}
export type DiarySettingsFactory = (
  dayModifier: IDayModifier,
  storageKey: string,
  version: number,
  playGamedataName: string,
  dayInterval: number
) => IDiarySettings;

export interface IDayModifier {
  /** 日付をどのように修飾するのかという文字列(日目、$Y年春$N日など) */
  get modifier(): string;
  set modifier(val: string);
  /** 周期的な単位が一度にどれだけ続くのか(15:春1-15,夏1-15など) */
  get cycleLength(): number;
  set cycleLength(val: number);

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
   * - cycle: 周期的に付与される単位、
   * - day: naturalDayをcycleLenで割った余り
   * - totalDay: 総経過日数。
   * @param naturalDay 修飾したい日付。レポートから呼び出されたなら総経過日数でもある。
   * @returns 日付の単位を付加した文字列
   */
  modifyDay(naturalDay: number): string;
}

export type DayModifierFactory = (
  modifier: string,
  cycleLength: number,
  ...unit: Array<string>
) => IDayModifier;
