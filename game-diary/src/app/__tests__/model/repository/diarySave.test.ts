import 'reflect-metadata';
import { DiarySave } from '@/model/repository/diarySave';
import { IDiary } from '@/model/diary/diaryModelInterfaces';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { container } from 'tsyringe';
import { MockDiary } from '@/__tests__/__mocks__/mockDiary';
import { CompressDiary } from '@/model/serialization/serializationInterface';
import { MockDiarySettings } from '@/__tests__/__mocks__/mockDiarySettings';

describe('DiarySave', () => {
  let diarySave: DiarySave;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockCompressDiary: jest.Mock<CompressDiary>;
  const mockSettings = new MockDiarySettings();
  beforeEach(() => {
    mockStorageService = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
    };

    mockCompressDiary = jest.fn().mockReturnValue('compressedDiaryData');

    container.registerInstance('IStorageService', mockStorageService);
    container.register('CompressDiary', { useValue: mockCompressDiary });
    container.register('IDiary', MockDiary);
    container.register(DiarySave, DiarySave);
    diarySave = container.resolve(DiarySave);
  });

  it('should save the diary using storage service and compressDiary function', () => {
    const mockDiary: IDiary = container.resolve('IDiary');

    diarySave.save(mockDiary);

    expect(mockCompressDiary).toHaveBeenCalledWith(mockDiary);
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      mockSettings.storageKey,
      'compressedDiaryData'
    );
  });
});
