import STORAGE_CONSTANTS from '@features/diary/services/constants';
import { MockStorageService } from './mockStorageService';
import { readFileSync } from 'fs';
import { join } from 'path';

export class MockEnvironmentStorageService extends MockStorageService {
  constructor() {
    super();
    const fileName = join(__dirname, 'testFileV0.txt');
    const file = readFileSync(fileName).toString();
    const diaryKey = '726af4c3-30f9-4076-a42e-4645af041097';
    this.setItem(
      STORAGE_CONSTANTS.DIARY_NAME_LIST,
      JSON.stringify([diaryKey, 'test'])
    );
    this.setItem(STORAGE_CONSTANTS.CURRENT_DIARY_KEY, diaryKey);
    this.setItem(diaryKey, file);
  }
}
