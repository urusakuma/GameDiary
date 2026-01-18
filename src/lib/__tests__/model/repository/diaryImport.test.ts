import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import DiaryImport from '@/model/repository/diaryImport';
import { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import DiaryNameService from '@/control/controlDiary/diaryNameService';
import { IDiary, IDiarySettings } from '@/model/diary/diaryModelInterfaces';

describe('DiaryImport', () => {
  let diaryImport: DiaryImport;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockDiaryDecompressor: jest.Mocked<IDiaryDecompressor>;
  let diaryNameService: jest.Mocked<DiaryNameService>;
  let mockDiary: jest.Mocked<IDiary>;
  let mockSettings: jest.Mocked<IDiarySettings>;
  const storageKey = 'testKey';
  const diaryName = 'My Diary';
  const uniqueName = 'Unique Diary Name';
  beforeEach(() => {
    mockSettings = {
      storageKey: storageKey,
      getDiaryName: jest.fn().mockReturnValue(diaryName),
      setDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiarySettings>;
    mockDiary = {
      getSettings: jest.fn().mockReturnValue(mockSettings),
    } as unknown as jest.Mocked<IDiary>;
    mockDiaryService = {
      addDiary: jest.fn(),
    } as unknown as jest.Mocked<IDiaryService>;
    mockDiaryDecompressor = {
      decompressDiary: jest.fn().mockReturnValue(mockDiary),
    };
    diaryNameService = {
      updateDiaryName: jest.fn().mockReturnValue(uniqueName),
    } as unknown as jest.Mocked<DiaryNameService>;
    diaryImport = new DiaryImport(
      mockDiaryService,
      mockDiaryDecompressor,
      diaryNameService
    );
  });

  it('should process diary import by decompressing, saving, and updating names', () => {
    const diaryStr = 'diaryData';
    diaryImport.import(diaryStr);

    expect(mockDiaryDecompressor.decompressDiary).toHaveBeenCalledWith(
      diaryStr
    );
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(mockDiary);
    expect(diaryNameService.updateDiaryName).toHaveBeenCalledWith(
      storageKey,
      diaryName
    );
    expect(mockSettings.getDiaryName).toHaveBeenCalledWith();
    expect(mockSettings.setDiaryName).toHaveBeenCalledWith(uniqueName);
  });
});
