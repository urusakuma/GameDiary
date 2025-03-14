import 'reflect-metadata';
import { container } from 'tsyringe';
import { CurrentDiaryManager } from '@/model/repository/currentDiaryManager';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import { DairySettingsConstant } from '@/dairySettingsConstant';
import { isStorageAvailable } from '@/model/utils/storageService';

jest.mock('@/model/utils/storageService', () => ({
  isStorageAvailable: jest.fn(),
}));

describe('CurrentDiaryManager', () => {
  let storageServiceMock: jest.Mocked<IStorageService>;

  beforeEach(() => {
    storageServiceMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
    };
    container.registerInstance('IStorageService', storageServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not set currentDiaryKey if storage is not available', () => {
    (isStorageAvailable as jest.Mock).mockReturnValue(false);

    const manager = new CurrentDiaryManager(storageServiceMock);

    expect(manager.getCurrentDiaryKey()).toBe('');
    expect(storageServiceMock.getItem).not.toHaveBeenCalled();
  });

  it('should set currentDiaryKey if storage is available and key exists', () => {
    (isStorageAvailable as jest.Mock).mockReturnValue(true);
    storageServiceMock.getItem.mockReturnValue('test-key');

    const manager = new CurrentDiaryManager(storageServiceMock);

    expect(manager.getCurrentDiaryKey()).toBe('test-key');
    expect(storageServiceMock.getItem).toHaveBeenCalledWith(
      DairySettingsConstant.CURRENT_DIARY_KEY
    );
  });

  it('should not set currentDiaryKey if storage is available but key does not exist', () => {
    (isStorageAvailable as jest.Mock).mockReturnValue(true);
    storageServiceMock.getItem.mockReturnValue(null);

    const manager = new CurrentDiaryManager(storageServiceMock);

    expect(manager.getCurrentDiaryKey()).toBe('');
    expect(storageServiceMock.getItem).toHaveBeenCalledWith(
      DairySettingsConstant.CURRENT_DIARY_KEY
    );
  });
  it('should set currentDiaryKey', () => {
    const manager = new CurrentDiaryManager(storageServiceMock);

    const key = 'test-key';
    manager.setCurrentDiaryKey(key);
    expect(manager.getCurrentDiaryKey()).toBe(key);
    expect(storageServiceMock.setItem).toHaveBeenCalledWith(
      DairySettingsConstant.CURRENT_DIARY_KEY,
      key
    );
  });
});
