/**
 * 定数を管理するためのクラス。
 */
export class DairySettingsConstant {
  static readonly CURRENT_VERSION: number = 1;
  static readonly DEFAULT_DIARY_NAME: string = '新しい日記';
  static readonly DEFAULT_DAY_INTERVAL: number = 1;

  static readonly DEFAULT_DAY_MODIFIER: string = '日目';
  static readonly DEFAULT_CYCLE_LENGTH: number = 10;
  static readonly YEAR_PLACEHOLDER: string = '$Y';
  static readonly CYCLE_PLACEHOLDER: string = '$C';
  static readonly DAY_PLACEHOLDER: string = '$D';
  static readonly TOTAL_DAYS_PLACEHOLDER: string = '$N';
  /** v0で使用。実際にはストレージキーが入るためv1で修正 */
  static readonly CURRENT_GAME_DATA_NAME: string = 'currentGameDataName';
  static readonly CURRENT_DIARY_KEY: string = 'currentDiaryKey';
  /** v0で使用。名前を変更したためv1で修正 */
  static readonly GAME_DATA_NAME_LIST: string = 'gameDataNameList';
  static readonly DIARY_NAME_LIST: string = 'diaryNameList';
}
