import { IDiary } from '@features/diary/model/diaryModelInterfaces';

export interface IDiaryDecompressor {
  /**
   * IDiaryを復号する関数。compressedが正しいことを前提にしており、間違っているとエラーを吐く。
   * @param compressed IDiaryを圧縮した文字列
   * @returns 復号されたIDiary
   * @throws {DecompressionError} 圧縮自体が破損している。コピペミス、1文字消しちゃったなど実際に有り得そうな例外。
   * @throws {InvalidJsonError} JSONオブジェクトが破損している。バグがない限り意図的に破損させないとこれは投げられない。
   */
  decompressDiary(compressed: string): IDiary;
}
export type CompressDiary = (diary: IDiary) => string;
