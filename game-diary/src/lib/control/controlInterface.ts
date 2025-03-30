import { IDiary, IDiaryEntry } from '../model/diary/diaryModelInterfaces';
/** カレントの日記へのアクセスを提供するクラス */
export interface ICurrentDiaryAccessor {
  /**
   * カレントの日記を取得する
   * @returns {IDiary} カレントの日記
   */
  getCurrentDiary(): IDiary | undefined;
  /**
   * カレントの日記を設定する
   * @param {string} key 日記のキー
   */
  setCurrentDiary(key: string): void;
}
/** 新しい日記を作成するクラス */
export interface ICreateDiary {
  /**
   * カレントの日記から新しい日記を作成する
   */
  create(): void;
}
export interface IDeleteDiary {
  /**
   * 指定した日記を削除する
   * @param key 削除する日記のキー
   */
  delete(key: string): void;
}
/** 日記のデータをインポートする */
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
   * @returns {string} 復号したDiaryのKey
   */
  importFile(file: File): string;
}
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
  exportFile(): Blob;
}
/** カレントの日記をストレージに保存するハンドラ */
export interface IDiarySaveHandler {
  /**ストレージにDiaryを保存する。*/
  save(): void;
}

/** 受け取ったKeyの日記をロードし、カレントとして設定する*/
export interface IDiaryLoadHandler {
  /**
   * 日記のKeyを指定し、日記をカレントに読み込む。
   * @param {string} key  読み込む日記のキー。
   */
  load(key: string): void;
}
/** カレントの日記のエントリへのアクセスを提供するクラス */
export interface ICurrentDiaryEntryAccessor {
  /**
   * カレントの日記のエントリを取得する
   * @returns {IDiaryEntry} カレントの日記のエントリ
   */
  getCurrentDiaryEntry(): IDiaryEntry;
  /**
   * カレントの日記のエントリを設定する
   * @param {number} day 日記のエントリの日付
   */
  setCurrentDiaryEntry(day: number): void;
}
/** カレントの日記のエントリを変更するクラス */
export interface IChangeCurrentDiaryEntry {
  /**
   * カレントの日記のエントリを指定した日付に変更する
   * @param date 日付
   */
  moveByDate(date: number): void;
  /**
   * カレントの日記のエントリを次の日付に変更する
   * 次の日付のエントリが存在しない場合は新しく作成する
   */
  moveToNext(): void;
  /**
   * カレントの日記のエントリを前の日付に変更する
   * 前の日付のエントリが存在しない場合は何もしない
   */
  moveToPrevious(): void;
}
/** 日記のエントリを削除するクラス */
export interface IDeleteDiaryEntry {
  /**
   * 指定した日付の日記のエントリを削除する
   * @param {number} day 削除する日記のエントリの日付
   */
  delete(day: number): void;
}
/** 日記の設定を編集するクラス */
export interface IEditDiarySettings {
  /**
   * 日記の名前を変更する
   * @param name 日記の名前
   */
  editDiaryName(name: string): void;
  /**
   * 日記の間隔を変更する
   * @param interval 日記の間隔
   */
  editDayInterval(interval: number): void;
  /**
   * 日記の修飾子を変更する
   * @param modifier 日記の修飾子
   */
  editDayModifier(modifier: string): void;
  /**
   * 日記のサイクルの修飾子を変更する
   * @param cycle どのサイクルの修飾子を変更するか
   * @param cycleModifier サイクルの修飾子
   */
  editDayModifierCycle(cycle: number, cycleModifier: string): void;
}
export interface IEditDiaryEntry {
  /**
   * 日記のエントリのタイトルを変更する
   * @param title 日記のタイトル
   */
  editTitle(title: string): void;
  /**
   * 日記のエントリの内容を変更する
   * @param content 日記の内容
   */
  editContent(content: string): void;
  /**
   * カレントの日記のエントリの内容を空にしタイトルを初期状態に戻す
   */
  clear(): void;
}
