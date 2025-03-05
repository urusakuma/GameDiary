import 'reflect-metadata';
import { IDiary } from '@/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';
import { MockDiary } from '@/__tests__/__mocks__/mockDiary';
import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import { MockDiarySettings } from '@/__tests__/__mocks__/mockDiarySettings';
import { DiaryImport } from '@/model/repository/diaryImport';
import { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';

describe('DiarySave', () => {
  let diaryImport: DiaryImport;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let mockDiaryDecompressor: jest.Mocked<IDiaryDecompressor>;
  const mockDiary = new MockDiary();
  beforeEach(() => {
    mockDiaryService = {
      addDiary: jest.fn(),
      getDiary: jest.fn(),
      deleteDiary: jest.fn(),
    };

    mockDiaryDecompressor = {
      decompressDiary: jest.fn().mockReturnValue(mockDiary),
    };

    container.registerInstance('IDiaryService', mockDiaryService);
    container.register<IDiaryDecompressor>('IDiaryDecompressor', {
      useValue: mockDiaryDecompressor,
    });
    container.register(DiaryImport, DiaryImport);
    diaryImport = container.resolve(DiaryImport);
  });

  it('should save the diary using storage service and compressDiary function', () => {
    const dairyStr = 'diaryData';
    diaryImport.import(dairyStr);

    expect(mockDiaryDecompressor.decompressDiary).toHaveBeenCalledWith(
      dairyStr
    );
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(mockDiary);
  });
});
