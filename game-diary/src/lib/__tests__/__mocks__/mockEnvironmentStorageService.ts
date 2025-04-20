import DairySettingsConstant from '@/dairySettingsConstant';
import { MockStorageService } from './mockStorageService';
import { readFileSync } from 'fs';

export class MockEnvironmentStorageService extends MockStorageService {
  constructor() {
    super();
    const fileName = '/app/testFileV0.txt';
    const file = readFileSync(fileName).toString();
    const diaryKey = '726af4c3-30f9-4076-a42e-4645af041097';
    this.setItem(
      DairySettingsConstant.DIARY_NAME_LIST,
      JSON.stringify([diaryKey, 'test'])
    );
    this.setItem(DairySettingsConstant.CURRENT_DIARY_KEY, diaryKey);
    this.setItem(diaryKey, file);
  }
}
