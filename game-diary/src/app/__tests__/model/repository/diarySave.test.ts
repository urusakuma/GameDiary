import 'reflect-metadata';
import { DiarySave } from '@/model/repository/diarySave';
import { IDiary } from '@/model/diary/diaryModelInterfaces';
import {
  IsStorageAvailableFunc,
  IStorageService,
} from '@/model/utils/storageServiceInterface';
import { container } from 'tsyringe';
import { MockDiary } from '@/__tests__/__mocks__/mockDiary';
import { CompressDiary } from '@/model/serialization/serializationInterface';
import { MockDiarySettings } from '@/__tests__/__mocks__/mockDiarySettings';
import { UnusedStorageError } from '@/error';

describe('DiarySave', () => {
  let diarySave: DiarySave;
  let mockStorageService: jest.Mocked<IStorageService>;
  let mockCompressDiary: jest.Mocked<CompressDiary>;
  let mockIsStorageAvailableFunc: jest.Mocked<IsStorageAvailableFunc>;
  const mockSettings = new MockDiarySettings();
  beforeEach(() => {
    mockStorageService = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
    };

    mockCompressDiary = jest.fn().mockReturnValue('compressedDiaryData');
    container.register('IDiary', MockDiary);
    container.register(DiarySave, DiarySave);
  });

  it('should save the diary using storage service, isStorageAvailableFunc and compressDiaryFunc', () => {
    const mockDiary: IDiary = container.resolve('IDiary');
    mockIsStorageAvailableFunc = jest.fn().mockReturnValue(true);
    diarySave = new DiarySave(
      mockStorageService,
      mockCompressDiary,
      mockIsStorageAvailableFunc
    );
    diarySave.save(mockDiary);
    expect(mockCompressDiary).toHaveBeenCalledWith(mockDiary);
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      mockSettings.storageKey,
      'compressedDiaryData'
    );
  });
  it('should can not use teh storage', () => {
    const mockDiary: IDiary = container.resolve('IDiary');
    mockIsStorageAvailableFunc = jest.fn().mockReturnValue(false);
    diarySave = new DiarySave(
      mockStorageService,
      mockCompressDiary,
      mockIsStorageAvailableFunc
    );
    expect(() => diarySave.save(mockDiary)).toThrow(
      new UnusedStorageError('can not you use the storage')
    );
  });
});
