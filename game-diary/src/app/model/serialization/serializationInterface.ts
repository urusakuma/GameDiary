import { IDiary } from '../diaryInterfaces';

export interface IDiaryDecompressor {
  decompressDiary(compressed: string): IDiary;
}
