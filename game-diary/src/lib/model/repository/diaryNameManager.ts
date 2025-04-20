import DairySettingsConstant from '@/dairySettingsConstant';
import { isTypeMatch } from '@/model/utils/checkTypeMatch';
import type {
  IsStorageAvailableFunc,
  IStorageService,
} from '@/model/utils/storageServiceInterface';
import { inject, injectable } from 'tsyringe';
import { IDiaryNameManager } from './diaryRepositoryInterfaces';
import { InvalidJsonError } from '@/error';
@injectable()
export default class DiaryNameManager implements IDiaryNameManager {
  /** ストレージキーと名前の連想配列。ストレージキーがkey、ゲームデータ名がval。 */
  private diaryNameMap: Map<string, string> = new Map<string, string>();
  private diaryNames: Record<string, string> = {};

  constructor(
    @inject('IStorageService')
    private storage: IStorageService,
    @inject('IsStorageAvailableFunc')
    private isStorageAvailable: IsStorageAvailableFunc
  ) {
    // まず、itemListを初期化し、ストレージからゲームデータ名のリストを取得する。
    const recordStr = storage.getItem(DairySettingsConstant.DIARY_NAME_LIST);
    if (recordStr === null) {
      // nullならデータが存在しない
      return;
    }
    // 取得したJSONをゲームデータ名のリストに変換できるか確認
    const diaryNameRecordJson: unknown = JSON.parse(recordStr);
    if (!isTypeMatch(diaryNameRecordJson, 'record')) {
      throw new InvalidJsonError('diary_name_list is broken');
    }
    Object.entries(diaryNameRecordJson)
      .filter(
        (v): v is [string, string] =>
          isTypeMatch(v[0], 'string') && isTypeMatch(v[1], 'string')
      )
      .forEach((v) => {
        this.diaryNames[v[0]] = v[1];
      });
  }
  get length(): number {
    return this.diaryNameMap.size;
  }
  collectDiaryNames(): Array<string> {
    return Object.values(this.diaryNames);
  }

  updateDiaryName(key: string, name: string): boolean {
    // keyかnameが空文字なら変更不可
    if (key === '' || name === '') {
      return false;
    }
    //ストレージキーと名前を保存してストレージに登録する
    this.diaryNames[key] = name;
    if (this.isStorageAvailable(this.storage)) {
      this.storage.setItem(
        DairySettingsConstant.DIARY_NAME_LIST,
        JSON.stringify(this.diaryNames)
      );
    }
    return true;
  }

  removeDiaryName(key: string): void {
    const removeName = this.diaryNames[key];
    if (removeName === undefined) {
      return;
    }
    delete this.diaryNames[key];
    if (this.isStorageAvailable(this.storage)) {
      this.storage.setItem(
        DairySettingsConstant.DIARY_NAME_LIST,
        JSON.stringify(this.diaryNames)
      );
    }
  }
  isIncludeDiaryName(name: string): boolean {
    return Object.values(this.diaryNameMap).includes(name);
  }
}
