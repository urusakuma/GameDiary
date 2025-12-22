import 'reflect-metadata';
import DiarySettingsFactory from '@/model/diary/diarySettingsFactory';
import type {
  DefaultSettingsFactory,
  IDayModifier,
  IDiarySettings,
  IDiarySettingsFactory,
  StorageKeyFactory,
  UseExistingDataDayModifierFactory,
} from '@/model/diary/diaryModelInterfaces';

describe('DiarySettingsFactory - createUseExistingData', () => {
  let settingsFactory: IDiarySettingsFactory;
  let defaultSettingsFactory: DefaultSettingsFactory;
  let modifierFactory: UseExistingDataDayModifierFactory;
  let storageKeyFactory: StorageKeyFactory;
  const version = 1;
  let defaultSettings: IDiarySettings;
  const units = ['unit0', 'unit1', 'unit2', 'unit3'];
  const dayInterval = 3;
  const cycleLength = 15;
  const modifierStr = '日目';
  const diaryName = 'Test Diary';
  let modifier: IDayModifier;
  let settings: IDiarySettings;
  beforeEach(() => {
    modifier = {
      getCycleLength: jest.fn().mockReturnValue(cycleLength),
      getModifier: jest.fn().mockReturnValue(modifierStr),
      getUnit: jest.fn((i: number) => units[i]),
    } as unknown as IDayModifier;
    defaultSettings = {
      storageKey: 'defaultKey',
      version: version,
      getDiaryName: jest.fn().mockReturnValue(diaryName),
      getDayInterval: jest.fn().mockReturnValue(dayInterval),
      getCycleLength: jest.fn().mockReturnValue(cycleLength),
      getModifier: jest.fn().mockReturnValue(modifierStr),
      getModifierUnit: jest.fn((i: number) => units[i]),
    } as unknown as IDiarySettings;

    defaultSettingsFactory = jest.fn().mockReturnValue(defaultSettings);
    modifierFactory = jest.fn().mockReturnValue(modifier);
    storageKeyFactory = jest.fn().mockReturnValue('key0');
    settingsFactory = new DiarySettingsFactory(
      defaultSettingsFactory,
      modifierFactory,
      storageKeyFactory,
      version
    );
  });
  describe('createUseExistingData tests', () => {
    it('should creates DiarySettings using the provided data when the data is valid', () => {
      settings = settingsFactory.createUseExistingData(
        modifier,
        diaryName,
        dayInterval,
        'defaultKey'
      );
      expect(settings.getCycleLength()).toBe(cycleLength);
      expect(settings.getDayInterval()).toBe(dayInterval);
      expect(settings.getDiaryName()).toBe(diaryName);
      expect(settings.getModifier()).toBe(modifierStr);
      for (let i = 0; i < 4; i++) {
        expect(settings.getModifierUnit(i)).toBe(units[i]);
      }
    });
    it('should dayInterval to 1 when the provided value is less 1', () => {
      settings = settingsFactory.createUseExistingData(
        modifier,
        diaryName,
        0,
        'defaultKey'
      );
      expect(settings.getDayInterval()).toBe(1);
    });
    it('should truncates the decimal part of dayInterval when a non-integer value is previoded', () => {
      settings = settingsFactory.createUseExistingData(
        modifier,
        diaryName,
        3.999,
        'defaultKey'
      );
      expect(settings.getDayInterval()).toBe(3);
      settings = settingsFactory.createUseExistingData(
        modifier,
        diaryName,
        0.999,
        'defaultKey'
      );
      expect(settings.getDayInterval()).toBe(1);
    });
  });
  describe('createNewDiarySettings tests', () => {
    let oldSettings: IDiarySettings;
    beforeEach(() => {
      oldSettings = {
        storageKey: 'defaultKey',
        version: version,
        getDiaryName: jest.fn().mockReturnValue(diaryName),
        getDayInterval: jest.fn().mockReturnValue(dayInterval),
        getCycleLength: jest.fn().mockReturnValue(cycleLength),
        getModifier: jest.fn().mockReturnValue(modifierStr),
        getModifierUnit: jest.fn((i: number) => units[i]),
      } as unknown as IDiarySettings;
    });
    it('should DiarySettings using default settings when no arguments are provided', () => {
      settings = settingsFactory.createNewDiarySettings();
      expectSettingsCopiedFrom(defaultSettings, settings);
      expectNameToUseProvidedSettings(defaultSettings, settings);
    });
    it('should DiarySettings using the provided settings when settings are given', () => {
      settings = settingsFactory.createNewDiarySettings(oldSettings);
      expectSettingsCopiedFrom(oldSettings, settings);
      expectNameToUseProvidedSettings(oldSettings, settings);
    });
    it('should DiarySettings using default settings and overrrides only the name when name is provided', () => {
      settings = settingsFactory.createNewDiarySettings(undefined, diaryName);
      expectSettingsCopiedFrom(defaultSettings, settings);
      expectNameToUseProvidedValue(defaultSettings, settings);
    });
    it('should copy the given settings and override only the name when both arguments are provided', () => {
      settings = settingsFactory.createNewDiarySettings(oldSettings, diaryName);
      expectSettingsCopiedFrom(oldSettings, settings);
      expectNameToUseProvidedValue(oldSettings, settings);
    });

    function expectSettingsCopiedFrom(
      providedSettings: IDiarySettings,
      settings: IDiarySettings
    ) {
      expect(providedSettings.getCycleLength).toHaveBeenCalledTimes(1);
      expect(settings.getCycleLength()).toBe(cycleLength);
      expect(providedSettings.getDayInterval).toHaveBeenCalledTimes(1);
      expect(settings.getDayInterval()).toBe(dayInterval);
      expect(providedSettings.getModifier).toHaveBeenCalledTimes(1);
      expect(settings.getModifier()).toBe(modifierStr);
      expect(providedSettings.getModifierUnit).toHaveBeenCalledTimes(
        units.length
      );
      for (let i = 0; i < units.length; i++) {
        expect(providedSettings.getModifierUnit).toHaveBeenNthCalledWith(
          i + 1,
          i
        );
        expect(settings.getModifierUnit(i)).toBe(units[i]);
      }
      expect(settings.storageKey).not.toBe(providedSettings.storageKey);
      expect(settings.version).toBe(version);
    }
    function expectNameToUseProvidedSettings(
      providedSettings: IDiarySettings,
      settings: IDiarySettings
    ) {
      expect(providedSettings.getDiaryName).toHaveBeenCalledTimes(1);
      expect(settings.getDiaryName()).toBe(diaryName);
    }
    function expectNameToUseProvidedValue(
      providedSettings: IDiarySettings,
      settings: IDiarySettings
    ) {
      expect(providedSettings.getDiaryName).not.toHaveBeenCalled();
      expect(settings.getDiaryName()).toBe(diaryName);
    }
  });
});
