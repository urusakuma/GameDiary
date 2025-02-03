import { container } from 'tsyringe';
import { DiaryKeyMapper } from '@/control/diaryKeyMapper';
import { IDiaryKeyMapper } from '@/control/diaryControlInterfaces';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { MockV1StorageService } from '../__mocks__/mockV1StorageService';
import { KeyNotFoundError, NotSupportedError } from '@/error';
import { MockStorageService } from '../__mocks__/mockStorageService';
import { MockUnavailableStorageService } from '../__mocks__/mockUnavailableStorageService';

describe('DiaryKeyMapper class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockV1StorageService
    );
    container.register<IDiaryKeyMapper>('IDiaryKeyMapper', {
      useClass: DiaryKeyMapper,
    });
  });
  test('DiaryNames test', () => {
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    // 初期データの読み込み
    const diaryNameList = Array<String>();
    for (let i = 0; i < 5; i++) {
      const itemName = 'testName' + String(i);
      diaryNameList.push(itemName);
    }
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);
    // 新しい名前の登録
    diaryKeyMapper.updateDiaryName('testKey', 'testName');
    diaryNameList.push('testName');
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);
    // 日記名の削除
    diaryKeyMapper.removeDiaryName('testKey0');
    diaryNameList.shift();
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);
    // キー・名前が空白の場合変更しない
    diaryKeyMapper.updateDiaryName('', 'testName99');
    diaryKeyMapper.updateDiaryName('testKey99', '');
    diaryKeyMapper.updateDiaryName('testKey', '');
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);

    // 同名の日記が存在する場合、1から始まる数字が付加される
    diaryKeyMapper.updateDiaryName('testKey5', 'testName');
    diaryNameList.push('testName5');
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);

    // hasのテスト
    expect(diaryKeyMapper.hasDiaryName('testName1')).toBeTruthy();
    expect(diaryKeyMapper.hasDiaryName('testName99')).toBeFalsy();
  });
  test('CurrentDiaryKey test', () => {
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    // 初期データの読み込み
    expect(diaryKeyMapper.getCurrentDiaryKey()).toBe('testKey0');
    // カレントの変更
    diaryKeyMapper.setCurrentDiaryKey('testKey1');
    expect(diaryKeyMapper.getCurrentDiaryKey()).toBe('testKey1');
    // 存在しないKeyをカレントにできない
    expect(() => diaryKeyMapper.setCurrentDiaryKey('testKey99')).toThrow(
      new KeyNotFoundError('not exist testKey99')
    );
  });
});
describe('EmptyStorage DiaryKeyMapper class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockStorageService
    );
    container.register<IDiaryKeyMapper>('IDiaryKeyMapper', {
      useClass: DiaryKeyMapper,
    });
  });
  test('DiaryNames test', () => {
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject([]);
  });
  test('CurrentDiaryKey test', () => {
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    expect(diaryKeyMapper.getCurrentDiaryKey()).toBeNull();
  });
});

describe('UnavailableStorage DiaryKeyMapper class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.registerSingleton<IStorageService>(
      'IStorageService',
      MockUnavailableStorageService
    );
    container.register<IDiaryKeyMapper>('IDiaryKeyMapper', {
      useClass: DiaryKeyMapper,
    });
  });
  test("can't use storage", () => {
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    expect(() => diaryKeyMapper.collectDiaryNames()).toThrow(NotSupportedError);
    expect(() => diaryKeyMapper.getCurrentDiaryKey()).toThrow(
      NotSupportedError
    );
    expect(() => diaryKeyMapper.removeDiaryName('Key')).toThrow(
      NotSupportedError
    );
    expect(() => diaryKeyMapper.setCurrentDiaryKey('Key')).toThrow(
      NotSupportedError
    );
    expect(() => diaryKeyMapper.updateDiaryName('Key', 'Name')).toThrow(
      NotSupportedError
    );
    expect(diaryKeyMapper.length).toBe(0);
  });
});
