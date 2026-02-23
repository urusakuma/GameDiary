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
   * @returns {boolean} 登録に成功した場合はtrue、失敗した場合はfalse。
   */
  setItem(key: string, value: string): boolean;
  /**
   * ストレージから文字列を削除する。
   * @param key 削除する文字列のKey
   */
  removeItem(key: string): void;
  /** ストレージが利用可能かどうか返却する。
   * @returns {boolean} ストレージが使用可能ならtrue、使用できないならfalse。
   */
  isStorageAvailable(): boolean;
  /** 登録されている文字列の数  */
  length: number;
}
