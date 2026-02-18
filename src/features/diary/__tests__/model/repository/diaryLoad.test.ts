import 'reflect-metadata';
import { IDiaryDecompressor } from '@features/diary/services/serialization/serializationInterface';
import { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import DiaryLoad from '@features/diary/services/persistence/diaryLoad';
import { IStorageService } from '@shared/utils/storageServiceInterface';
import { KeyNotFoundError } from '@lib/error';
import { IDiaryNameService } from '@features/diary/control/diary/controlDiaryInterface';
import {
  IDiary,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';

describe('DiaryLoad', () => {
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockDiaryDecompressor: jest.Mocked<IDiaryDecompressor>;
  let mockDiaryNameService: jest.Mocked<IDiaryNameService>;
  let mockDiary: jest.Mocked<IDiary>;
  const diaryKey = 'diaryKey';
  beforeEach(() => {
    mockDiaryService = {
      getDiary: jest.fn(),
      addDiary: jest.fn(),
    } as unknown as jest.Mocked<IDiaryService>;
    mockStorageService = {
      getItem: jest.fn(),
    } as unknown as jest.Mocked<IStorageService>;
    mockDiaryDecompressor = {
      decompressDiary: jest.fn(),
    };
    mockDiaryNameService = {
      updateDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiaryNameService>;
    mockDiary = {
      getSettings: jest.fn().mockReturnValue({
        getDiaryName: jest.fn().mockReturnValue('Original Diary Name'),
        setDiaryName: jest.fn(),
        storageKey: diaryKey,
      } as unknown as jest.Mocked<IDiarySettings>),
    } as unknown as jest.Mocked<IDiary>;
  });
  it('should read from IDiaryService if data exists', () => {
    // DiaryServiceにデータがある場合、そちらを読み込んで返却する
    mockDiaryService.getDiary.mockReturnValue(mockDiary);
    const diaryLoad = new DiaryLoad(
      mockDiaryService,
      mockStorageService,
      mockDiaryDecompressor,
      mockDiaryNameService
    );
    const loadResult = diaryLoad.load(diaryKey);
    expect(loadResult).toBe(mockDiary);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(diaryKey);
  });
  it('should return a KeyNotFoundError if the data does not exist in either IDiaryService or IStorageService', () => {
    // DiaryServiceにもストレージにもデータがない場合、エラーをスローする
    mockDiaryService.getDiary.mockReturnValue(undefined);
    mockStorageService.getItem.mockReturnValue(null);
    const diaryLoad = new DiaryLoad(
      mockDiaryService,
      mockStorageService,
      mockDiaryDecompressor,
      mockDiaryNameService
    );
    expect(() => diaryLoad.load(diaryKey)).toThrow(
      new KeyNotFoundError(`Key "${diaryKey}" not found`)
    );
  });
  it('should load and return diary from IStorageService when not found in IDiaryService', () => {
    mockDiaryService.getDiary.mockReturnValue(undefined);
    mockStorageService.getItem.mockReturnValue('compressedDiaryData');
    mockDiaryDecompressor.decompressDiary.mockReturnValue(mockDiary);
    mockDiaryNameService.updateDiaryName.mockReturnValue('Unique Diary Name');

    const diaryLoad = new DiaryLoad(
      mockDiaryService,
      mockStorageService,
      mockDiaryDecompressor,
      mockDiaryNameService
    );
    const loadResult = diaryLoad.load(diaryKey);

    expect(loadResult).toBe(mockDiary);
    expect(mockStorageService.getItem).toHaveBeenCalledWith(diaryKey);
    expect(mockDiaryDecompressor.decompressDiary).toHaveBeenCalledWith(
      'compressedDiaryData'
    );
    expect(mockDiaryNameService.updateDiaryName).toHaveBeenCalledWith(
      diaryKey,
      mockDiary.getSettings().getDiaryName()
    );
    expect(mockDiary.getSettings().setDiaryName).toHaveBeenCalledWith(
      'Unique Diary Name'
    );
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(mockDiary);
  });
});
