import { DairySettingsConstant } from '@/dairySettingsConstant';
import { MockStorageService } from './mockStorageService';

export class MockV1StorageService extends MockStorageService {
  constructor() {
    super();
    const itemList = Array<[string, string]>();
    for (let i = 0; i < 5; i++) {
      const itemKey = 'testKey' + String(i);
      const itemName = 'testName' + String(i);
      itemList.push([itemKey, itemName]);
    }
    this.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify(itemList)
    );
    this.setItem(DairySettingsConstant.CURRENT_GAME_DATA_NAME, 'testKey0');
  }
}
