import { IDiary, IDiarySettings } from '@/model/diary/diaryModelInterfaces';

export interface IDiaryService {
  /**
   * カレントのDiaryへのアクセスを提供する。
   * @returns カレントのDiary
   */
  getCurrentDiary(): IDiary;
  /**
   * 日記名のリストを返却する。
   * @returns {Array<string>} 日記名のリスト。
   */
  collectGameDataNames(): Array<string>;

  /**ストレージにDiaryを保存する。*/
  save(): void;

  /**
   * ストレージのKeyを指定し、ストレージからDiaryを読み込む。
   * 読み込みに失敗した場合はストレージから削除しておく。
   * @param {string} key  読み込む日記のキー。
   * @throws {KeyNotFoundError} 要素がローカルストレージに存在しない。
   */
  load(key: string): void;
  /**
   * 文字列をユーザから直接受け取ってレポートに復号、複合出来たらカレントの日記にする。
   * @param {string} val ユーザから受け取った文字列。
   * @throws {DecompressionError} 圧縮した文字列が破損している。
   * @throws {InvalidJsonError} 圧縮されているJSONが破損している。
   */
  import(val: string): void;
  /**
   * Diaryのデータを文字列に変換して出力する。
   * @returns {string} レポートを圧縮した文字列
   */
  export(): string;

  /**
   * 新しいセーブデータを作り出す。
   * @param gameName 画面上に表示する日記の名前
   */
  create(gameName: string): void;
  /**
   * 指定したKeyのDiaryを削除する。
   * カレントのDiaryなら削除できない。
   * @param {string} key 削除する日記の名前。
   * @returns 削除に成功したならtrue、失敗したならfalse
   */
  remove(key: string): boolean;
}
export interface IDiaryLoader {
  /**
   * 指定したGameDataNameのDiaryを取得する。特に指定がないならカレントを指定されたものとする。
   * @param {string?} key 取得するDiaryのストレージキー、指定していないならカレントを指定されたものとする。
   * @returns {IDiary} 取得するIDiary
   */
  loadDiary(key?: string): IDiary;
  /**
   * 新しいDiaryを作成する関数。作成されたDiaryを現在のDiaryにする。
   * @returns 新しく作成されたDiary
   */
  createNewDiary(settings?: IDiarySettings): IDiary;
}
export interface IDiaryKeyMapper {
  /** 保存された日記の数を返す */
  get length(): number;
  /**
   * 保存されている日記名の配列を返す。
   * @returns {Array<string>} 日記名の配列
   */
  collectGameDataNames(): Array<string>;
  /**
   * 新しい日記名を保存する。既に存在するストレージキーを指定した場合、上書きする。
   * 既に存在する名前は入れられない。
   * @param key 日記名を引き出すストレージキー
   * @param name 日記名
   * @returns 保存に成功したならtrue、失敗したならfalse
   */
  setGameDataName(key: string, name: string): boolean;
  /**
   * 指定したストレージキーを日記リストから取り除く。
   * @param key 取り除く日記のストレージキー
   */
  removeGameDataName(key: string): void;
  /**
   * 現在操作している日記のストレージキーを返す。
   * @returns 現在操作している日記のストレージキー
   */
  getCurrentGameDataKey(): string;
  /**
   * 現在操作している日記のストレージキーを変更する。
   * @param key 新しく操作する日記のストレージキー
   */
  setCurrentGameDataKey(key: string): void;
}
export interface IDiaryDataMigrator {
  migrate(): void;
}
export interface IKeyNamePair {
  getKey(): string;
  getName(): string;
  setName(newName: string): void;
}
