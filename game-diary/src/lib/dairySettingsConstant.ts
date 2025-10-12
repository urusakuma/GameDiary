/**
 * 定数を管理するためのクラス。
 */
export default class DairySettingsConstant {
  static readonly CURRENT_VERSION: number = 1;
  static readonly DEFAULT_DIARY_NAME: string = '新しい日記';
  static readonly DEFAULT_DAY_INTERVAL: number = 1;

  static readonly DEFAULT_CYCLE_LENGTH: number = 10;
  static readonly YEAR_PLACEHOLDER: string = '$Y';
  static readonly CYCLE_PLACEHOLDER: string = '$C';
  static readonly DAY_PLACEHOLDER: string = '$D';
  static readonly TOTAL_DAYS_PLACEHOLDER: string = '$N';
  static readonly DEFAULT_DAY_MODIFIER: string =
    DairySettingsConstant.TOTAL_DAYS_PLACEHOLDER + '日目';

  /** v0で使用していたカレントの日記のストレージキーを保存するためのキー。実際にはストレージキーが入るためv1で修正 */
  static readonly CURRENT_GAME_DATA_NAME: string = 'currentGameDataName';
  /** v1で使用しているカレントの日記のストレージキーを保存するためのキー */
  static readonly CURRENT_DIARY_KEY: string = 'currentDiaryKey';
  /** v0で使用していた日記名リストを保存するためのキー。名前を変更したためv1で修正 */
  static readonly GAME_DATA_NAME_LIST: string = 'gameDataNameList';
  /** v1で使用している日記名リストを保存するためのキー */
  static readonly DIARY_NAME_LIST: string = 'diaryNameList';
}
