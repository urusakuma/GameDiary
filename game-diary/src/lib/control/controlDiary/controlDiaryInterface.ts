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
   * 指定した日記がカレントの場合、削除しない
   * @param key 削除する日記のキー
   * @returns {boolean} 日記の削除に成功したならtrue
   */
  delete(key: string): boolean;
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
   * @returns {Promise<string>} 復号したDiaryのKey
   */
  importFile(file: File): Promise<string>;
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
