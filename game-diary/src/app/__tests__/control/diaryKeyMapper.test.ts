import { container } from 'tsyringe';
import { DiaryKeyMapper } from '@/control/diaryKeyMapper';
import { IDiaryKeyMapper } from '@/control/diaryControlInterfaces';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { MockV1StorageService } from '../__mocks__/mockV1StorageService';
import { KeyNotFoundError, NotSupportedError } from '@/error';
import { MockStorageService } from '../__mocks__/mockStorageService';
import { DairySettingsConstant } from '@/dairySettingsConstant';
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
    diaryKeyMapper.updateDiaryName('test_key', 'test_name');
    diaryNameList.push('test_name');
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);
    // 日記名の削除
    diaryKeyMapper.removeDiaryName('testKey0');
    diaryNameList.shift();
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);
    // キー・名前が空白の場合変更しない
    diaryKeyMapper.updateDiaryName('', 'testName99');
    diaryKeyMapper.updateDiaryName('testKey99', '');
    diaryKeyMapper.updateDiaryName('test_key', '');
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject(diaryNameList);
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
    // 新しい日記を作成してもカレントは変わらない
    diaryKeyMapper.createNewDiaryName();
    expect(diaryKeyMapper.getCurrentDiaryKey()).toMatch('testKey1');
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
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject([
      DairySettingsConstant.NEW_DIARY_NAME,
    ]);
  });
  test('CurrentDiaryKey test', () => {
    const storage = container.resolve<IStorageService>('IStorageService');
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i; // UUIDv4
    expect(diaryKeyMapper.getCurrentDiaryKey()).toMatch(uuidRegex);

    // カレントが削除され他に日記が存在しないとき、新しい日記を作成する。
    const firstKey = diaryKeyMapper.getCurrentDiaryKey();
    diaryKeyMapper.removeDiaryName(firstKey);
    expect(diaryKeyMapper.getCurrentDiaryKey()).not.toBe(firstKey);

    //ストレージを直接操作してカレントを削除されたとき、例外をスローしながら何らかの日記をカレントにする。
    const secondKey = diaryKeyMapper.getCurrentDiaryKey();
    storage.removeItem(DairySettingsConstant.CURRENT_DIARY_KEY);
    expect(() => diaryKeyMapper.getCurrentDiaryKey()).toThrow(
      new KeyNotFoundError('not exist current_diary_key')
    );
    expect(diaryKeyMapper.getCurrentDiaryKey()).toBe(secondKey);

    // ストレージからcurrent_diary_keyとdiary_name_listを消してもメモリから復元できる。
    storage.removeItem(DairySettingsConstant.DIARY_NAME_LIST);
    storage.removeItem(DairySettingsConstant.CURRENT_DIARY_KEY);
    expect(() => diaryKeyMapper.getCurrentDiaryKey()).toThrow(
      new KeyNotFoundError('not exist current_diary_key')
    );
    expect(diaryKeyMapper.getCurrentDiaryKey()).toBe(secondKey);

    // 同名の日記が存在する場合、数字が付加される
    diaryKeyMapper.createNewDiaryName();
    diaryKeyMapper.createNewDiaryName();
    expect(diaryKeyMapper.collectDiaryNames()).toMatchObject([
      DairySettingsConstant.NEW_DIARY_NAME,
      DairySettingsConstant.NEW_DIARY_NAME + '1',
      DairySettingsConstant.NEW_DIARY_NAME + '2',
    ]);
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
  test("don't use storage", () => {
    const diaryKeyMapper =
      container.resolve<IDiaryKeyMapper>('IDiaryKeyMapper');
    expect(() => diaryKeyMapper.collectDiaryNames()).toThrow(NotSupportedError);
    expect(() => diaryKeyMapper.createNewDiaryName()).toThrow(
      NotSupportedError
    );
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
