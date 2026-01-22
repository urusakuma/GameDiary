import 'reflect-metadata';
import DiarySave from '@/model/repository/diarySave';
import { IDiary, IDiarySettings } from '@/model/diary/diaryModelInterfaces';
import { IStorageService } from '@/model/utils/storageServiceInterface';
import { CompressDiary } from '@/model/serialization/serializationInterface';

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
