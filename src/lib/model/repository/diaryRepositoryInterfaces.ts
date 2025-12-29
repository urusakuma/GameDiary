import { IDiary } from '@/model/diary/diaryModelInterfaces';

/**
 * Diaryをメモリ上に保管し、取得・追加・削除を行うクラス。
 * このクラスが持たずにストレージ上にあることはあっても、ストレージが持たずにこのクラスが持つことはない。
 */
export interface IDiaryService {
  /**
   * 指定したKeyのDiaryを取得する。
   * @param {string} key 取得するDiaryのストレージキー
   * @returns {IDiary} 取得したDiary
   */
  getDiary(key: string): IDiary | undefined;
  /**
   * 渡されたDiaryを保管する。ストレージにも保存する。
   * @param {IDiary} diary 保管するDiary
   */
  addDiary(diary: IDiary): void;
  /**
   * 指定したKeyのDiaryを削除する。ストレージからも取り除く。
   * @param {string} key 削除する日記の名前
   */
  deleteDiary(key: string): void;
}
/**
 * 日記の名前とユニークな日記のキーを対応させストレージに保存するクラス。
 */
export interface IDiaryNameManager {
  /** 保存された日記の数を返す */
  get length(): number;
  /**
   * 保存されているストレージキーと日記名の配列を返す。
   * @returns {Array<[string, string]> } [ストレージキー, 日記名]の配列
   */
  collectDiaryNameEntries(): Array<[string, string]>;
  /**
   * 指定したストレージキーの日記名を返す。
   * @param key ストレージキー
   * @returns {string} 指定したストレージキーの日記名
   */
  getDiaryName(key: string): string;
  /**
   * ストレージキーを指定して日記名を更新する。新規作成もここで行われる。
   * 名前が既に存在するときは数字を追加して別の名前にする。
   * @param key 日記名と対応したストレージキー
   * @param name 新しい日記名
   * @returns 保存に成功したならtrue、失敗したならfalse
   */
  updateDiaryName(key: string, name: string): boolean;
  /**
   * 指定したストレージキーに対応した日記名を日記リストから取り除く。
   * 日記名だけを取り除き、日記そのものを取り除くことはない。
   * @param key 取り除く日記のストレージキー
   */
  removeDiaryName(key: string): void;
  /**
   * 指定した名前がすでに存在するか確認する
   * @param name 存在するか確認する名前
   * @returns すでに存在するならtrue、存在しないならfalse
   */
  hasDiaryName(name: string): boolean;
}
/**
 * ストレージに保存されたカレントの日記・名前とキーのペアを最新のバージョンに適合させるクラス。
 * 関数が呼び出されたときにストレージを適合させる。
 */
export interface IDiaryDataMigrator {
  /**
   * ストレージに保存された日記のカレント・名前とキーのペアを最新のバージョンに適合させる。
   */
  migrate(): void;
}

/** ユニークな日記名を生成するクラス */
export interface IUniqueDiaryNameGenerator {
  /**
   * 受け取った名前をユニークな名前に変換して返却する。
   * @param {string} name ユニークにしたい名前
   * @param {string} [key] 既存の日記のキー（更新時に使用）
   * @returns {string} ユニークな名前
   */
  generate(name: string, key?: string): string;
}
/** カレントのDiaryがどのDiaryであるかKeyで管理するクラス */
export interface ICurrentDiaryManager {
  /**
   * カレントのDiaryのKeyを取得する。
   * @returns カレントのDiaryのkey
   */
  getCurrentDiaryKey(): string;
  /**
   * 指定されたKeyをカレントにしてストレージに保存する。
   * @param key 新しくカレントにするDiaryのKey
   */
  setCurrentDiaryKey(key: string): void;
}
/**
 * 受け取った文字列をDiaryに変換してストレージに保存する。
 */
export interface IDiaryImport {
  /**
   * 文字列をユーザから直接受け取ってDiaryに復号、複合出来たらそのDiaryのKeyを返却する。
   * 復号したDiaryはストレージに保存される。
   * @param {string} val ユーザから受け取った文字列。
   * @returns {string} 復号したDiaryのKey
   * @throws {DecompressionError} 圧縮した文字列が破損している。
   * @throws {InvalidJsonError} 圧縮されているJSONが破損している。
   */
  import(val: string): string;
}
/** KeyからDiaryを選択し、文字列に変換して返却する */
export interface IDiaryExport {
  /**
   * Diaryのデータを文字列に変換して出力する。
   * @returns {string} Diaryを圧縮した文字列
   */
  export(key: string): string;
}
/** 受け取ったDiaryをストレージに保存する */
export interface IDiarySave {
  /**ストレージにDiaryを保存する。*/
  save(diary: IDiary): boolean;
}

/**
 * 受け取ったKeyからストレージのデータを読み取り、IDiaryに変換して返却する。
 */
export interface IDiaryLoad {
  /**
   * 日記のKeyを指定し、ストレージからDiaryを読み込む。
   * 読み込みに失敗した場合はストレージから削除しておく。
   * @param {string} key  読み込む日記のキー。
   * @throws {KeyNotFoundError} 要素がローカルストレージに存在しない。
   */
  load(key: string): IDiary;
}
