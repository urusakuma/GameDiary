import { IDiary } from '@features/diary/model/diaryModelInterfaces';

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