/** 前日のエントリーと設定クラスから新しいエントリーを生成する */
export type UsePreviousDayDiaryEntryFactory = (
  source: IDiaryEntry,
  settings: IDiarySettings
) => IDiaryEntry;

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
/**
 * 新しい日記を作成する関数。
 * Diaryを受け取った場合、DiaryのSettingsからストレージキー以外をコピーする。
 * @param {IDiary?} diary 新しいDiaryのSettingsの基となるDiary
 * @returns {IDiary} 作成したDiary
 */
export interface IDiaryFactory {
  createUseExistingData(
    diaryEntries: Map<number, IDiaryEntry>,
    settings: IDiarySettings,
    lastDay: number
  ): IDiary;
  createNewDiary(diary?: IDiary, name?: string): IDiary;
}
/**
 * 1日分の日記を管理するクラス
 */
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
/** IDiaryEntryを生成するファクトリクラス */
export interface IDiaryEntryFactory {
  createUsePreviousDay(
    source: IDiaryEntry,
    settings: IDiarySettings
  ): IDiaryEntry;
  createUseExistingData(
    day: number,
    title: string,
    content: string,
    previous: number | undefined,
    next: number | undefined
  ): IDiaryEntry;
}
export type NewDiaryEntriesFactory = () => Map<number, IDiaryEntry>;

/** 既存の情報から新しいエントリーを組み立てる */
export type UseExistingDataDiaryEntryFactory = (
  day: number,
  title: string,
  content: string,
  previous: number | undefined,
  next: number | undefined
) => IDiaryEntry;
/**
 * ストレージキーを生成するファクトリ関数
 * @returns ストレージキー
 */
export type StorageKeyFactory = () => string;
/**
 * 日記の設定を管理するクラス
 */
export interface IDiarySettings {
  /** 日記データを識別する一意の文字列 */
  get storageKey(): string;
  /** 日記データのバージョン */
  get version(): number;
  /** 日記名を保存する */
  setDiaryName(val: string): void;
  /** 日記名を取得する */
  getDiaryName(): string;
  /** 日記を書く間隔 */
  updateDayInterval(val: number): void;
  /** 日記を書く間隔を取得する */
  getDayInterval(): number;
  /** 日付をどのように修飾するのかという文字列(日目、$Y年春$D日など)を保存 */
  setModifier(val: string): void;
  /** 日付を修飾する文字列を取得する */
  getModifier(): string;
  /**
   * 日付を修飾する周期的な単位を設定する。空文字を設定された場合は取り除く
   * @param val 設定する単位の文字列。
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
/** IDiarySettingsを生成するファクトリクラス */
export interface IDiarySettingsFactory {
  /**
   * ストレージなどに保存された設定をから新しい設定を作成する。
   * @param dayModifier 日付を修飾する文字列
   * @param diaryName 日記の名前
   * @param dayInterval 日記を書く間隔
   * @param storageKey ストレージキー
   * @returns 複合した設定
   */
  createUseExistingData(
    dayModifier: IDayModifier,
    diaryName: string,
    dayInterval: number,
    storageKey: string
  ): IDiarySettings;
  /**
   * 新しい日記のための設定を作成する。
   * @param settings 引き継ぐ既存の設定。
   * @param name 日記の名前。省略した場合はデフォルトの名前が使用される。
   * @returns 新しい設定
   */
  createNewDiarySettings(
    settings?: IDiarySettings,
    name?: string
  ): IDiarySettings;
}
/**
 * ベースとなる設定を生成するファクトリ関数
 */
export type DefaultSettingsFactory = () => IDiarySettings;

/**
 * 日付を修飾するクラス
 */
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
/**
 * 日付を修飾するクラスを生成するファクトリ関数
 */
export type NewDayModifierFactory = (dayModifier: IDayModifier) => IDayModifier;
/**
 * 保存されたデータから日付を修飾するクラスを生成するファクトリ関数
 */
export type UseExistingDataDayModifierFactory = (
  modifier: string,
  cycleLength: number,
  ...unit: Array<string>
) => IDayModifier;
