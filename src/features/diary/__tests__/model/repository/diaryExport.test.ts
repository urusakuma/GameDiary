import DiaryExport from '@features/diary/services/persistence/diaryExport';
import { IDiary } from '@features/diary/model/diaryModelInterfaces';
import { CompressDiary } from '@features/diary/services/serialization/serializationInterface';
import { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';

describe('DiaryExport', () => {
  let diaryExport: DiaryExport;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockCompressDiary: jest.Mocked<CompressDiary>;
  let mockDiary: IDiary;
  const storageKey = 'testDiaryKey';
  const compressedDIaryStr = 'compressedDiaryData';
  beforeEach(() => {
    mockDiary = {} as unknown as IDiary;
    mockDiaryService = {
      getDiary: jest.fn(),
    } as unknown as jest.Mocked<IDiaryService>;
    mockCompressDiary = jest.fn().mockReturnValue(compressedDIaryStr);
    diaryExport = new DiaryExport(mockDiaryService, mockCompressDiary);
  });

  it('should export the diary by reading from storage and compressing it', () => {
    mockDiaryService.getDiary.mockReturnValue(mockDiary);
    const result = diaryExport.export(storageKey);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(storageKey);
    expect(mockCompressDiary).toHaveBeenCalledWith(mockDiary);
    expect(result).toBe('compressedDiaryData');
  });
  it('should return empty string if diary does not exist', () => {
    mockDiaryService.getDiary.mockReturnValue(undefined);
    const result = diaryExport.export(storageKey);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(storageKey);
    expect(mockCompressDiary).not.toHaveBeenCalled();
    expect(result).toBe('');
  });
});
