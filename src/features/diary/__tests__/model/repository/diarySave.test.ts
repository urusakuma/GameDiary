import 'reflect-metadata';
import DiarySave from '@features/diary/services/persistence/diarySave';
import {
  IDiary,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';
import { IStorageService } from '@features/diary/services/persistence/storageServiceInterface';
import { CompressDiary } from '@features/diary/services/serialization/serializationInterface';

describe('DiarySave', () => {
  let diarySave: DiarySave;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockCompressDiary: jest.Mocked<CompressDiary>;
  let mockSettings: jest.Mocked<IDiarySettings>;
  let mockDiary: jest.Mocked<IDiary>;
  beforeEach(() => {
    mockStorageService = {
      setItem: jest.fn(),
    } as unknown as jest.Mocked<IStorageService>;
    mockSettings = {
      storageKey: 'diaryStorageKey',
    } as unknown as jest.Mocked<IDiarySettings>;
    mockDiary = {
      getSettings: jest.fn().mockReturnValue(mockSettings),
    } as unknown as jest.Mocked<IDiary>;
    mockCompressDiary = jest.fn().mockReturnValue('compressedDiaryData');
  });

  it('should compress diary and save it using storage key', () => {
    mockStorageService.setItem.mockReturnValue(true);
    diarySave = new DiarySave(mockStorageService, mockCompressDiary);
    const result = diarySave.save(mockDiary);
    expect(result).toBeTruthy();
    expect(mockCompressDiary).toHaveBeenCalledWith(mockDiary);
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      mockSettings.storageKey,
      'compressedDiaryData'
    );
  });
  it('should return false when setItem fails', () => {
    mockStorageService.setItem.mockReturnValue(false);
    diarySave = new DiarySave(mockStorageService, mockCompressDiary);
    const result = diarySave.save(mockDiary);
    expect(result).toBeFalsy();
  });
});
