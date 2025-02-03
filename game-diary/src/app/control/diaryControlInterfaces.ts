import { IDiary, IDiarySettings } from '@/model/diary/diaryModelInterfaces';

/**
 * Diaryを管理し、Diaryへのアクセスを他クラスに提供する。
 */
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
  collectDiaryNames(): Array<string>;

  /**ストレージにDiaryを保存する。*/
  save(): void;

  /**
   * 日記のKeyを指定し、ストレージからDiaryを読み込む。
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
   * @param diaryName 画面上に表示する日記の名前
   */
  create(diaryName: string): void;
  /**
   * 指定したKeyのDiaryを削除する。
   * カレントのDiaryなら削除できない。
   * @param {string} key 削除する日記の名前。
   * @returns 削除に成功したならtrue、失敗したならfalse
   */
  remove(key: string): boolean;
}
/**
 * ストレージからDiaryを読み込み返却する。
 */
export interface IDiaryLoader {
  /**
   * 指定したDiaryNameのDiaryを取得する。特に指定がないならカレントを指定されたものとする。
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
/**
 * 日記の名前とユニークな日記のキーを対応させストレージに保存するクラス
 * このクラスはローカルストレージに保存されているデータが正常であるかの判断は行わない
 */
export interface IDiaryKeyMapper {
  /** 保存された日記の数を返す */
  get length(): number;
  /**
   * 保存されている日記名の配列を返す。
   * @returns {Array<string>} 日記名の配列
   */
  collectDiaryNames(): Array<string>;
  /**
   * ストレージキーを指定して日記名を更新する。新規作成もここで行われる。
   * 名前が既に存在するときは数字を追加して別の名前にする。
   * 保存する際にO(n)の処理が挟まるため呼び出しに注意。
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
   * 現在操作している日記のストレージキーを返す。
   * @returns 現在操作している日記のストレージキー
   */
  getCurrentDiaryKey(): string | null;
  /**
   * 現在操作している日記のストレージキーを変更する。
   * @param key 新しく操作する日記のストレージキー
   */
  setCurrentDiaryKey(key: string): void;

  /**
   * 指定した名前がすでに存在するか確認する
   * @param name 存在するか確認する名前
   * @returns すでに存在するならtrue、存在しないならfalse
   */
  hasDiaryName(name: string): boolean;
}
export interface IDiaryDataMigrator {
  /**
   * ストレージに保存された日記のカレントや名前とキーのペアを最新のバージョンに適合させる
   */
  migrate(): void;
}
export interface IKeyNamePair {
  getKey(): string;
  getName(): string;
  setName(newName: string): void;
}
