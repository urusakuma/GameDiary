import { IDiaryEntry } from '@features/diary/model/diaryModelInterfaces';

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
   * @returns {boolean} 新しいエントリを作成した場合はtrue、既存のエントリに移動した場合はfalse
   */
  moveToNext(): boolean;
  /**
   * カレントの日記のエントリを前の日付に変更する
   * 前の日付のエントリが存在しない場合は何もしない
   * @returns {boolean} 元の日付のエントリが削除された場合はtrue、元のエントリを削除しなければfalse
   */
  moveToPrevious(): boolean;
}
/** 日記のエントリを削除するクラス */
export interface IDeleteDiaryEntry {
  /**
   * 指定した日付の日記のエントリを削除する
   * @param {number} day 削除する日記のエントリの日付
   */
  delete(day: number): void;
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
