import { DairySettingsConstant } from '@/dairySettingsConstant';
import { MockStorageService } from './mockStorageService';

export class MockV1StorageService extends MockStorageService {
  constructor() {
    super();
    const itemRecord: Record<string, string> = {};
    for (let i = 0; i < 5; i++) {
      const itemKey = 'testKey' + String(i);
      const itemName = 'testName' + String(i);
      itemRecord[itemKey] = itemName;
    }
    this.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify(itemRecord)
    );
    this.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, 'testKey0');
  }
}
