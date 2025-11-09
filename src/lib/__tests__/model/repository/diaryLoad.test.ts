import 'reflect-metadata';
import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import DiaryLoad from '@/model/repository/diaryLoad';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { KeyNotFoundError } from '@/error';
import { IDiaryNameService } from '@/control/controlDiary/controlDiaryInterface';
import { IDiary, IDiarySettings } from '@/model/diary/diaryModelInterfaces';

describe('DiaryLoad', () => {
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockDiaryDecompressor: jest.Mocked<IDiaryDecompressor>;
  let mockDIaryNameService: jest.Mocked<IDiaryNameService>;
  let mockDiary: jest.Mocked<IDiary>;
  const dairyKey = 'diaryKey';
  const diaryServiceDate = 'diaryDate in DiaryService';
  const storageServiceDate = 'diaryDate in StorageService';
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
    mockDIaryNameService = {
      updateDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiaryNameService>;
    mockDiary = {
      getSettings: jest.fn().mockReturnValue({
        getDiaryName: jest.fn().mockReturnValue('Original Diary Name'),
        setDiaryName: jest.fn(),
        storageKey: dairyKey,
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
      mockDIaryNameService
    );
    const loadResult = diaryLoad.load(dairyKey);
    expect(loadResult).toBe(mockDiary);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(dairyKey);
  });
  it('should return a KeyNotFoundError if the data does not exist in either IDiaryService or IStorageService', () => {
    // DiaryServiceにもストレージにもデータがない場合、エラーをスローする
    mockDiaryService.getDiary.mockReturnValue(undefined);
    mockStorageService.getItem.mockReturnValue(null);
    const diaryLoad = new DiaryLoad(
      mockDiaryService,
      mockStorageService,
      mockDiaryDecompressor,
      mockDIaryNameService
    );
    expect(() => diaryLoad.load(dairyKey)).toThrow(
      new KeyNotFoundError(`Key "${dairyKey}" not found`)
    );
  });
  it('should load and return diary from IStorageService when not found in IDiaryService', () => {
    mockDiaryService.getDiary.mockReturnValue(undefined);
    mockStorageService.getItem.mockReturnValue('compressedDiaryData');
    mockDiaryDecompressor.decompressDiary.mockReturnValue(mockDiary);
    mockDIaryNameService.updateDiaryName.mockReturnValue('Unique Diary Name');

    const diaryLoad = new DiaryLoad(
      mockDiaryService,
      mockStorageService,
      mockDiaryDecompressor,
      mockDIaryNameService
    );
    const loadResult = diaryLoad.load(dairyKey);

    expect(loadResult).toBe(mockDiary);
    expect(mockStorageService.getItem).toHaveBeenCalledWith(dairyKey);
    expect(mockDiaryDecompressor.decompressDiary).toHaveBeenCalledWith(
      'compressedDiaryData'
    );
    expect(mockDIaryNameService.updateDiaryName).toHaveBeenCalledWith(
      dairyKey,
      mockDiary.getSettings().getDiaryName()
    );
    expect(mockDiary.getSettings().setDiaryName).toHaveBeenCalledWith(
      'Unique Diary Name'
    );
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(mockDiary);
  });
});
