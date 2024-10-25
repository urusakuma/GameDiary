export interface IStorageService {
  /**
   * ストレージから文字列を取得する。失敗した場合はnullを返す。
   * @param key 取得する文字列のKey
   */
  getItem(key: string): string | null;
  /**
   * ストレージに文字列を登録する。
   * @param key 登録する文字列のKey
   * @param value 登録する文字列
   */
  setItem(key: string, value: string): void;
  /**
   * ストレージから文字列を削除する。
   * @param key 削除する文字列のKey
   */
  removeItem(key: string): void;
  /** 登録されている文字列の数  */
  length: number;
}
