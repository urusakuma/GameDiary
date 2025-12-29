import { IDiary } from '@/model/diary/diaryModelInterfaces';
/** カレントの日記へのアクセスを提供するクラス */
export interface ICurrentDiaryAccessor {
  /**
   * カレントの日記を取得する
   * @returns {IDiary} カレントの日記
   */
  getCurrentDiary(): IDiary;
  /**
   * カレントの日記を設定する
   * @param {string} key 日記のキー
   */
  setCurrentDiary(key: string): void;
}
/**
 * IDiaryNameManagerを使用して日記名を管理するサービス。
 * 日記名の取得、更新、削除などの操作を提供する。
 */
export interface IDiaryNameService {
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
   * ストレージキーを指定して日記名を追加する。updateDiaryNameと同様の動作をする。
   * 名前が既に存在するときは数字を追加して別の名前にする。
   * @param key 日記名と対応したストレージキー
   * @param name 新しい日記名
   * @returns 一意であることが保証された新しい日記名
   */
  addDiaryName(key: string, name: string): string;
  /**
   * ストレージキーを指定して日記名を更新する。
   * 名前が既に存在するときは数字を追加して別の名前にする。
   * @param key 日記名と対応したストレージキー
   * @param name 新しい日記名
   * @returns 一意であることが保証された新しい日記名
   */
  updateDiaryName(key: string, name: string): string;
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
 * Diaryのデータをカプセル化する型
 */
export type DiarySummary = {
  key: string;
  name: string;
};
/** 新しい日記を作成するクラス */
export interface ICreateDiary {
  /**
   * カレントの日記から新しい日記を作成する
   * @returns {DiarySummary} 生成したDIaryのDiarySummary
   */
  create(name: string): DiarySummary;
  createDefaultDiary(): DiarySummary;
}
export interface IDeleteDiary {
  /**
   * 指定した日記を削除する
   * 指定した日記がカレントの場合、削除しない
   * @param key 削除する日記のキー
   * @returns {boolean} 日記の削除に成功したならtrue
   */
  delete(key: string): boolean;
}
/**
 * 日記のデータをインポートする。
 * インポートした日記をストレージに保存し、カレントに設定する。
 */
export interface IDiaryImporter {
  /**
   * 文字列をユーザから直接受け取ってDiaryに復号、複合出来たらそのDiaryのKeyを返却する。
   * @param {string} val ユーザから受け取った文字列。
   * @returns {string} 復号したDiaryのKey
   */
  importText(val: string): string;
  /**
   * テキストファイルをユーザから受け取ってDiaryに復号、複合出来たらそのDiaryのKeyを返却する。
   * @param {File} file ユーザから受け取ったテキストファイル
   * @returns {Promise<string>} 復号したDiaryのKey
   */
  importFile(file: File): Promise<string>;
}
/**
 * 日記のデータをファイルとして出力するのに必要なデータをやり取りするための型
 */
export type ExportFile = {
  data: Blob;
  fileName: string;
};
/** カレントの日記を出力する */
export interface IDiaryExporter {
  /**
   * Diaryのデータを文字列に変換して出力する。
   * @returns {string} Diaryを圧縮した文字列
   */
  exportText(): string;
  /**
   * DiaryのデータをBlobに変換して出力する。
   * 文字列ではなくBlobを返すことで、ファイルとして保存できるようにする。
   * @returns {Blob} Diaryを圧縮したBlob
   */
  exportFile(): ExportFile;
}
/** カレントの日記をストレージに保存するハンドラ */
export interface IDiarySaveHandler {
  /**ストレージにDiaryを保存する。
   * @return {boolean} 保存に成功したならtrue、失敗したならfalse
   */
  save(): boolean;
}

/** 受け取ったKeyの日記をロードし、カレントとして設定する*/
export interface IDiaryLoadHandler {
  /**
   * 日記のKeyを指定し、日記をカレントに読み込む。
   * @param {string} key  読み込む日記のキー。
   */
  load(key: string): void;
}
