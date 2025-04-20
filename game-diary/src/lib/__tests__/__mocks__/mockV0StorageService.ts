import DairySettingsConstant from '@/dairySettingsConstant';
import { MockStorageService } from './mockStorageService';
import { injectable, singleton } from 'tsyringe';
@singleton()
@injectable()
export class MockV0StorageService extends MockStorageService {
  constructor() {
    super();
    const itemList = Array<Item>();
    for (let i = 0; i < 5; i++) {
      const itemKey = 'testKey' + String(i);
      const itemName = 'testName' + String(i);
      itemList.push(new Item(itemKey, itemName));
    }
    this.setItem(
      DairySettingsConstant.GAME_DATA_NAME_LIST,
      JSON.stringify(itemList)
    );
    this.setItem(DairySettingsConstant.CURRENT_GAME_DATA_NAME, 'testKey0');
  }
}

class Item {
  storageKey: string;
  playGamedataName: string; // dateがDataではないのはv0でのtypo。
  constructor(storageKey: string, playGamedataName: string) {
    this.storageKey = storageKey;
    this.playGamedataName = playGamedataName;
  }
}
