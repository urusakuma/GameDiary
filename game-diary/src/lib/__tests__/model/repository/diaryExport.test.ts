import 'reflect-metadata';
import { IDiary } from '@/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';
import { MockDiary } from '@/__tests__/__mocks__/mockDiary';
import { CompressDiary } from '@/model/serialization/serializationInterface';
import { MockDiarySettings } from '@/__tests__/__mocks__/mockDiarySettings';
import { DiaryExport } from '@/model/repository/diaryExport';
import { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';

describe('DiaryExport', () => {
  let diaryExport: DiaryExport;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockCompressDiary: jest.Mock<CompressDiary>;
  const mockSettings = new MockDiarySettings();
  const mockDiary: IDiary = new MockDiary();
  beforeEach(() => {
    mockDiaryService = {
      addDiary: jest.fn(),
      getDiary: jest.fn().mockReturnValueOnce(mockDiary),
      deleteDiary: jest.fn(),
    };

    mockCompressDiary = jest.fn().mockReturnValue('compressedDiaryData');

    container.registerInstance('IDiaryService', mockDiaryService);
    container.register('CompressDiary', { useValue: mockCompressDiary });
    container.register('IDiary', MockDiary);
    container.register(DiaryExport, DiaryExport);
    diaryExport = container.resolve(DiaryExport);
  });

  it('should save the diary using storage service and compressDiary function', () => {
    // mockDiaryService.getDiary returns mockDiary
    const validExportResult = diaryExport.export(mockSettings.storageKey);
    expect(validExportResult).toBe('compressedDiaryData');
    expect(mockCompressDiary).toHaveBeenCalledWith(mockDiary);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(
      mockSettings.storageKey
    );

    // mockDiaryService.getDiary returns undefined
    const emptyExportResult = diaryExport.export(mockSettings.storageKey);
    expect(emptyExportResult).toBe('');
  });
});
