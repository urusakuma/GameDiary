/**
 * 定数を管理するためのクラス。
 */
export class DairySettingsConstant {
  //TODO:DairySettingsConstantにリネーム
  static readonly CURRENT_VERSION: number = 1;
  static readonly DEFAULT_GAME_DATA_NAME: string = 'new game data';
  static readonly DEFAULT_DAY_INTERVAL: number = 1;

  static readonly DEFAULT_DAY_MODIFIER: string = '日目';
  static readonly DEFAULT_CYCLE_LENGTH: number = 10;
  static readonly YEAR_PLACEHOLDER: string = '$Y';
  static readonly CYCLE_PLACEHOLDER: string = '$C';
  static readonly DAY_PLACEHOLDER: string = '$D';
  static readonly TOTAL_DAYS_PLACEHOLDER: string = '$N';

  static readonly CURRENT_GAME_DATA_NAME: string = 'currentGameDataName';
  static readonly GAME_DATA_NAME_LIST: string = 'gameDataNameList';
}
