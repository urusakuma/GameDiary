import { inject, singleton } from 'tsyringe';
import { KeyNotFoundError } from '@/error';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import type { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import type { IDiary } from '@/model/diary/diaryModelInterfaces';
import type {
  IDiaryNameManager,
  IDiaryLoader,
  IDiaryService,
} from './diaryRepositoryInterfaces';
import { compressDiary } from '@/model/serialization/diarySerializer';
import {
  isStorageAvailable,
  notSupportFunc,
} from '@/model/utils/storageService';
/**
 * 全ての日記を管理するクラス。
 */
@singleton()
export class DiaryService implements IDiaryService {
  /** 現在利用している日記 */
  private currentDiary: IDiary;
  constructor(
    @inject('StorageService')
    private storage: IStorageService,
    @inject('DiaryDecompressor')
    private diaryDecompressor: IDiaryDecompressor,
    @inject('DiaryLoader')
    private diaryLoader: IDiaryLoader,
    @inject('DiaryKeyMapper')
    private diaryKeyMapper: IDiaryNameManager
  ) {
    if (!isStorageAvailable(storage)) {
      this.save = notSupportFunc;
      this.load = notSupportFunc;
      this.remove = notSupportFunc;
      this.create = notSupportFunc;
      this.currentDiary = this.diaryLoader.loadDiary();
      notSupportFunc();
    }
    this.currentDiary = this.diaryLoader.loadDiary();
  }

  getCurrentDiary = (): IDiary => {
    return this.currentDiary;
  };

  collectDiaryNames = (): Array<string> => {
    return this.diaryKeyMapper.collectDiaryNames();
  };

  save = (): void => {
    // セーブデータを文字列に変換する
    const savaStr = compressDiary(this.currentDiary);
    //変換したセーブデータをキーと紐づけてストレージに保存
    const key = this.currentDiary.getSettings().storageKey;
    this.storage.setItem(key, savaStr);
  };

  load = (key: string): void => {
    // ストレージから圧縮されたDiaryを持ってくる。
    const loadStr = this.storage.getItem(key);
    if (loadStr === null) {
      // Diaryが存在しないなら名前リストから削除してエラーを吐く
      this.diaryKeyMapper.removeDiaryName(key);
      throw new KeyNotFoundError(`not exists Key= ${key}`);
    }
    //デシリアライズした内容をカレントレポートに変更する。
    const newReport = this.diaryDecompressor.decompressDiary(loadStr);
    this.changeCurrentDiary(newReport);
  };

  import = (val: string): void => {
    const diary = this.diaryDecompressor.decompressDiary(val);
    this.changeCurrentDiary(diary);
    this.save();
  };

  export = (): string => {
    return compressDiary(this.currentDiary);
  };

  create = (diaryName: string): void => {
    // 現在の設定に基づいて新しいDiaryを作成する。
    const newDiary = this.diaryLoader.createNewDiary(
      this.currentDiary.getSettings()
    );
    // カレントのDiaryを今作成したものに変更する。
    this.changeCurrentDiary(newDiary);
    // 新しいDiaryを保存する。
    this.diaryKeyMapper.updateDiaryName(
      newDiary.getSettings().storageKey,
      diaryName
    );
    this.save();
  };

  remove = (key: string): boolean => {
    if (this.currentDiary.getSettings().storageKey) {
      return false;
    }
    this.storage.removeItem(key);
    this.diaryKeyMapper.removeDiaryName(key);
    return true;
  };

  /**
   * カレントの日記を変更する関数。
   * @param diary 新しくカレントになる日記
   */
  private changeCurrentDiary = (diary: IDiary): void => {
    this.currentDiary = diary;
    this.diaryKeyMapper.setCurrentDiaryKey(diary.getSettings().storageKey);
  };
}
