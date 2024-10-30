import { ArgumentError, KeyNotFoundError, NotSupportedError } from '@/error';
import { Constant } from '@/constant';
import { compressDiary } from './serialization/diarySerializer';
import { isStorageAvailable, notSupportFunc } from './utils/storageService';
import { inject, singleton } from 'tsyringe';
import type { IStorageService } from './utils/storageServiceInterface';
import type { IDiaryDecompressor } from './serialization/serializationInterface';
import type { IDiary, IDiaryKeyMapper, IDiaryLoader } from './diaryInterfaces';
/**
 * レポートを保存・削除・新規作成してストレージに保存するクラス
 *
 */
@singleton()
export class DiaryService {
  private _currentDiary: IDiary;
  public constructor(
    @inject('StorageService')
    private storage: IStorageService,
    @inject('DiaryDecompressor')
    private diaryDecompressor: IDiaryDecompressor,
    @inject('DiaryLoader')
    private diaryLoader: IDiaryLoader,
    @inject('DiaryKeyMapper')
    private diaryKeyMapper: IDiaryKeyMapper
  ) {
    if (!isStorageAvailable(storage)) {
      this.save = notSupportFunc;
      this.load = notSupportFunc;
      this.remove = notSupportFunc;
      this.create = notSupportFunc;
      this._currentDiary = this.diaryLoader.loadDiaryAsCurrent();
      notSupportFunc();
    }
    this._currentDiary = this.diaryLoader.loadDiaryAsCurrent();
  }
  public get currentDiary(): IDiary {
    return this._currentDiary;
  }
  /**
   * ゲームデータ名のリストを返却する。
   * @returns {Array<string>} ゲームデータ名のリストを値渡しで複製したもの。
   */
  collectGameDataNames(): Array<string> {
    return this.diaryKeyMapper.collectGameDataNames();
  }

  /**
   * ローカルストレージにDiaryを保存する。
   */
  public save = (): void => {
    // セーブデータを文字列に変換する
    const savaStr = compressDiary(this.currentDiary);
    const key = this.currentDiary.settings.storageKey;
    //変換したセーブデータをキーと紐づけてストレージに保存
    this.storage.setItem(key, savaStr);
  };
  /**
   * ローカルストレージのKeyを指定し、ローカルストレージからDiaryを読み込む。
   * 読み込みに失敗した場合はローカルストレージから削除しておく。
   * ローカルストレージに対応していない場合、コンストラクタで例外を投げるだけの関数に書き換えられる。
   * @param {string} key  読み込むゲームデータのキー。
   * @throws {ArgumentError} 要素がローカルストレージに存在しない。
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public load = (key: string): void => {
    const loadStr = localStorage.getItem(key);
    if (loadStr === null) {
      this.remove(key);
      throw new KeyNotFoundError(`not exists Key= ${key}`);
    }
    try {
      //デシリアライズした内容をカレントレポートに変更する。
      const newReport = decompressDiary(loadStr);

      this._currentDiary = newReport;
      localStorage.setItem(Constant.CURRENT_GAME_DATA_NAME, key);
    } catch (error) {
      if (error instanceof ArgumentError || error instanceof SyntaxError) {
        this.remove(key); // 不正な値が格納されているので削除しておく。
      }
      throw error;
    }
  };
  /**
   * Diaryのデータを文字列に変換して出力する。
   * @returns {string} レポートを圧縮した文字列
   */
  public export = (): string => {
    return compressDiary(this.currentDiary);
  };
  /**
   * 文字列をユーザから直接受け取ってレポートに復号、複合出来たら代入する。
   * @param {string} val ユーザから受け取った文字列。
   * @throws {ArgumentError} 引数に復号できない文字列を渡された。
   * @throws {SyntaxError} 引数にデシリアライズできない文字列を渡された。
   */
  public import = (val: string): void => {
    try {
      this._currentDiary = decompressDiary(val);
      this.save();
    } catch (error) {
      throw error;
    }
  };
  /**
   * ローカルストレージのKeyを指定し、ローカルストレージから削除する。gameDataNamesからも削除する。
   * ローカルストレージに対応していない場合、コンストラクタで例外を投げるだけの関数に書き換えられる。
   * @param {string} key 削除するゲームデータの名前。
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public remove = (key: string): void => {
    localStorage.removeItem(key);
    this._gameDataNames = this.gameDataNames.filter(
      (item) => item.storageKey !== key
    );
    localStorage.setItem(
      Constant.GAME_DATA_NAME_LIST,
      JSON.stringify(this.gameDataNames)
    );
  };
  /**
   * 新しいセーブデータを作り出す。
   * @param gameName 画面上に表示するゲームデータの名前
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public create = (gameName: string): void => {
    Storage.instance.reports.clear(crypto.randomUUID());
    Storage.instance.reports.settings.playGamedataName = gameName;

    this.diaryKeyMapper.setCurrentGameDataKey(settings.storageKey);
    this.save();
  };
}
