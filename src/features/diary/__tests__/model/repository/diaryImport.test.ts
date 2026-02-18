import { IDiaryDecompressor } from '@features/diary/services/serialization/serializationInterface';
import DiaryImport from '@features/diary/services/persistence/diaryImport';
import { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import DiaryNameService from '@features/diary/control/diary/accessors/diaryNameService';
import {
  IDiary,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';

describe('DiaryImport', () => {
  let diaryImport: DiaryImport;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockDiaryDecompressor: jest.Mocked<IDiaryDecompressor>;
  let diaryNameService: jest.Mocked<DiaryNameService>;
  let mockDiary: jest.Mocked<IDiary>;
  let mockSettings: jest.Mocked<IDiarySettings>;
  const storageKey = 'testKey';
  const DiaryName = 'My Diary';
  const uniqueName = 'Unique Diary Name';
  beforeEach(() => {
    mockSettings = {
      storageKey: storageKey,
      getDiaryName: jest.fn().mockReturnValue(DiaryName),
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
      DiaryName
    );
    expect(mockSettings.getDiaryName).toHaveBeenCalledWith();
    expect(mockSettings.setDiaryName).toHaveBeenCalledWith(uniqueName);
  });
});
