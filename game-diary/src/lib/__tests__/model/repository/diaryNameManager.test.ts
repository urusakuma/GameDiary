import { container } from 'tsyringe';
import { DiaryNameManager } from 'src/lib/model/repository/diaryNameManager';
import { IDiaryNameManager } from 'src/lib/model/repository/diaryRepositoryInterfaces';
import {
  IsStorageAvailableFunc,
  IStorageService,
} from 'src/lib/model/utils/storageServiceInterface';
import { MockV1StorageService } from '../../__mocks__/mockV1StorageService';
import { MockStorageService } from '../../__mocks__/mockStorageService';
import { isStorageAvailable } from 'src/lib/model/utils/storageService';

describe('DiaryNameManager class tests', () => {
  let diaryNameManager: IDiaryNameManager;
  let diaryNameList: Array<String>;
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockV1StorageService
    );
    container.register<IsStorageAvailableFunc>('IsStorageAvailableFunc', {
      useValue: isStorageAvailable,
    });
    container.register<IDiaryNameManager>('IDiaryNameManager', {
      useClass: DiaryNameManager,
    });
    diaryNameManager =
      container.resolve<IDiaryNameManager>('IDiaryNameManager');
    // 初期データの読み込み
    diaryNameList = Array<String>();
    for (let i = 0; i < 5; i++) {
      const itemName = 'testName' + String(i);
      diaryNameList.push(itemName);
    }
  });
  test('DiaryNames init', () => {
    expect(diaryNameManager.collectDiaryNames()).toMatchObject(diaryNameList);
  });
  it('DiaryName add', () => {
    diaryNameManager.updateDiaryName('testKey', 'testName');
    diaryNameList.push('testName');
    expect(diaryNameManager.collectDiaryNames()).toMatchObject(diaryNameList);
  });
  it('DiaryName remove', () => {
    diaryNameManager.removeDiaryName('testKey0');
    diaryNameList.shift();
    expect(diaryNameManager.collectDiaryNames()).toMatchObject(diaryNameList);
  });
  it('DiaryName do not change', () => {
    diaryNameManager.updateDiaryName('', 'testName99');
    diaryNameManager.updateDiaryName('testKey99', '');
    diaryNameManager.updateDiaryName('testKey', '');
    expect(diaryNameManager.collectDiaryNames()).toMatchObject(diaryNameList);
  });
});
describe('EmptyStorage DiaryNameManager class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockStorageService
    );
    container.register<IsStorageAvailableFunc>('IsStorageAvailableFunc', {
      useValue: isStorageAvailable,
    });
    container.register<IDiaryNameManager>('IDiaryNameManager', {
      useClass: DiaryNameManager,
    });
  });
  test('DiaryNames empty', () => {
    const diaryNameManager =
      container.resolve<IDiaryNameManager>('IDiaryNameManager');
    expect(diaryNameManager.collectDiaryNames()).toMatchObject([]);
  });
});
