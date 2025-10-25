import 'reflect-metadata';
import { container } from 'tsyringe';
import DiaryService from '@/model/repository/diaryService';
import type {
  IsStorageAvailableFunc,
  IStorageService,
} from '@/model/utils/storageServiceInterface';
import type {
  IDiary,
  IDiarySettings,
} from '@/model/diary/diaryModelInterfaces';
import { MockDiary } from '../../__mocks__/mockDiary';
import { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import { MockDiarySettings } from '../../__mocks__/mockDiarySettings';

describe('DiaryService', () => {
  let storageMock: jest.Mocked<IStorageService>;
  let diarySettings: IDiarySettings;
  let diaryService: IDiaryService;
  let isStorageAvailableFunc: jest.Mocked<IsStorageAvailableFunc>;
  const storageKey = 'bec0da1f-0053-4c59-acfb-f4a574bd8c98';
  const diary: IDiary = new MockDiary();
  beforeEach(() => {
    storageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
    };
    isStorageAvailableFunc = jest.fn().mockReturnValue(true);
    container.registerInstance('IStorageService', storageMock);
    container.register('MockKey', { useFactory: () => undefined });
    container.register<IDiarySettings>('IDiarySettings', {
      useClass: MockDiarySettings,
    });
    container.register<IsStorageAvailableFunc>('IsStorageAvailableFunc', {
      useValue: isStorageAvailableFunc,
    });
    container.register<IDiaryService>('IDiaryService', {
      useClass: DiaryService,
    });
    diarySettings = container.resolve<IDiarySettings>('IDiarySettings');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a diary and store it in storage', () => {
    diaryService = container.resolve<IDiaryService>('IDiaryService');
    diaryService.addDiary(diary);
    const storageKey = diarySettings.storageKey;
    expect(diaryService.getDiary(storageKey)).toBe(diary);
    expect(storageMock.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(diary)
    );
  });

  it('should retrieve a diary by key', () => {
    diaryService = container.resolve<IDiaryService>('IDiaryService');
    diaryService.addDiary(diary);
    const retrievedDiary = diaryService.getDiary(storageKey);
    expect(retrievedDiary).toBe(diary);
  });

  it('should delete a diary and remove it from storage', () => {
    diaryService = container.resolve<IDiaryService>('IDiaryService');
    diaryService.addDiary(diary);
    expect(diaryService.getDiary(storageKey)).not.toBeUndefined();
    diaryService.deleteDiary(storageKey);
    expect(diaryService.getDiary(storageKey)).toBeUndefined();
    expect(storageMock.removeItem).toHaveBeenCalledWith(storageKey);
  });
  it('do not use storage', () => {
    isStorageAvailableFunc = jest.fn().mockReturnValue(false);
    container.register<IsStorageAvailableFunc>('IsStorageAvailableFunc', {
      useValue: isStorageAvailableFunc,
    });
    diaryService = container.resolve<IDiaryService>('IDiaryService');
    diaryService.addDiary(diary);
    expect(diaryService.getDiary(storageKey)).toBe(diary);
    expect(storageMock.setItem).not.toHaveBeenCalled();
  });
});
