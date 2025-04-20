import 'reflect-metadata';
import { container } from 'tsyringe';
import { MockDiary } from '@/__tests__/__mocks__/mockDiary';
import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import DiaryLoad from '@/model/repository/diaryLoad';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { KeyNotFoundError } from '@/error';

describe('DiaryLoad', () => {
  let diaryLoad: DiaryLoad;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockDiaryDecompressor: jest.Mocked<IDiaryDecompressor>;
  const mockDiary = new MockDiary();
  const diaryServiceDate = 'diaryDate in DiaryService';
  const storageServiceDate = 'diaryDate in StorageService';
  beforeEach(() => {
    mockDiaryService = {
      addDiary: jest.fn(),
      getDiary: jest.fn().mockReturnValueOnce(diaryServiceDate),
      deleteDiary: jest.fn(),
    };
    mockStorageService = {
      setItem: jest.fn(),
      getItem: jest
        .fn()
        .mockReturnValueOnce(storageServiceDate)
        .mockReturnValue(null),
      removeItem: jest.fn(),
      length: 0,
    };
    mockDiaryDecompressor = {
      decompressDiary: jest.fn().mockReturnValue(mockDiary),
    };

    container.registerInstance('IDiaryService', mockDiaryService);
    container.registerInstance('IStorageService', mockStorageService);
    container.register<IDiaryDecompressor>('IDiaryDecompressor', {
      useValue: mockDiaryDecompressor,
    });
    container.register(DiaryLoad, DiaryLoad);
    diaryLoad = container.resolve(DiaryLoad);
  });

  it('should load the diary using diary service, storage service and decompressDiary function', () => {
    const dairyKey = 'diaryKey';
    // DiaryServiceにデータがある場合、そちらを読み込んで返却する
    let loadResult = diaryLoad.load(dairyKey);
    expect(loadResult).toBe(diaryServiceDate);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(dairyKey);

    // DiaryServiceにデータがない場合、ストレージからデータを復号して返却する
    // その際にDiaryServiceにデータを追加する
    loadResult = diaryLoad.load(dairyKey);
    expect(loadResult).toBe(mockDiary);
    expect(mockStorageService.getItem).toHaveBeenCalledWith(dairyKey);
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(mockDiary);

    // DiaryServiceにもストレージにもデータがない場合、エラーをスローする
    expect(() => diaryLoad.load(dairyKey)).toThrow(
      new KeyNotFoundError(`Key ${dairyKey} not found`)
    );
  });
});
