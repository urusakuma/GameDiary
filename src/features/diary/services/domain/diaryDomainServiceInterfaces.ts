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
