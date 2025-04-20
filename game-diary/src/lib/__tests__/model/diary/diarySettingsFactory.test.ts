import 'reflect-metadata';
import { container } from 'tsyringe';
import DiarySettingsFactory from '@/model/diary/diarySettingsFactory';
import DiarySettings from '@/model/diary/diarySettings';
import type {
  IDiarySettings,
  NewDayModifierFactory,
  StorageKeyFactory,
} from '@/model/diary/diaryModelInterfaces';
import { MockDayModifier } from '@/__tests__/__mocks__/mockDayModifier';
import { IUniqueDiaryNameGenerator } from '@/model/repository/diaryRepositoryInterfaces';

describe('DiarySettingsFactory - createUseExistingData', () => {
  const mockDayModifier = new MockDayModifier();
  const diaryName = 'Test Diary';
  const dayInterval = 3;
  const storageKey = 'testKey';
  const version = 1;
  let diarySettingsFactory: DiarySettingsFactory;
  let mockSettings: IDiarySettings;
  let mockModifierFactory: NewDayModifierFactory;
  let mockStorageKeyFactory: StorageKeyFactory;
  let mockNameGenerator: IUniqueDiaryNameGenerator;
  let mockDefaultSettingsFactory = beforeEach(() => {
    jest.restoreAllMocks();
    mockModifierFactory = jest.fn().mockReturnValue(mockDayModifier);
    mockStorageKeyFactory = jest.fn().mockReturnValue('testKey');
    mockSettings = {
      storageKey: storageKey,
      version: version,
      getDayInterval: jest.fn().mockReturnValue(dayInterval),
      getCycleLength: jest.fn().mockReturnValue(15),
      getModifier: jest.fn().mockReturnValue(mockDayModifier.getModifier()),
      getModifierUnit: jest.fn().mockReturnValue(mockDayModifier.getUnit(0)),
    } as unknown as IDiarySettings;
    mockDefaultSettingsFactory = jest.fn().mockReturnValue(mockSettings);

    mockNameGenerator = {
      generate: jest.fn().mockReturnValue(diaryName),
    };
    container.register('DefaultSettingsFactory', {
      useValue: mockDefaultSettingsFactory,
    });
    container.register('UseExistingDataDayModifierFactory', {
      useValue: mockModifierFactory,
    });
    container.register('StorageKeyFactory', {
      useValue: mockStorageKeyFactory,
    });
    container.register('IUniqueDiaryNameGenerator', {
      useValue: mockNameGenerator,
    });
    container.register('DefaultDiaryName', { useValue: diaryName });
    container.register('Version', { useValue: version });

    diarySettingsFactory = container.resolve(DiarySettingsFactory);
  });

  it('should create a DiarySettings instance with the provided parameters', () => {
    const result = diarySettingsFactory.createUseExistingData(
      mockDayModifier,
      diaryName,
      dayInterval,
      storageKey,
      version
    );
    correctSetting(result);
  });
  it('should create a DiarySettings instance with the provided parameters', () => {
    const result = diarySettingsFactory.createNewDiarySettings(mockSettings);
    correctSetting(result);
    checkCall();
  });
  it('should create a DiarySettings instance with the provided parameters', () => {
    const result = diarySettingsFactory.createNewDiarySettings();
    correctSetting(result);
    expect(mockDefaultSettingsFactory).toHaveBeenCalled();
    checkCall();
  });
  function correctSetting(result: IDiarySettings) {
    expect(result).toBeInstanceOf(DiarySettings);
    expect(result.getModifier()).toBe(mockDayModifier.getModifier());
    expect(result.getDiaryName()).toBe(diaryName);
    expect(result.getDayInterval()).toBe(dayInterval);
    expect(result.storageKey).toBe(storageKey);
    expect(result.version).toBe(version);
  }
  function checkCall() {
    for (let i = 0; i < 4; i++) {
      expect(mockSettings.getModifierUnit).toHaveBeenNthCalledWith(i + 1, i);
    }
    expect(mockSettings.getModifier).toHaveBeenCalled();
    expect(mockSettings.getCycleLength).toHaveBeenCalled();
    expect(mockNameGenerator.generate).toHaveBeenCalled();
    expect(mockSettings.getDayInterval).toHaveBeenCalled();
    expect(mockStorageKeyFactory).toHaveBeenCalled();
  }
});
