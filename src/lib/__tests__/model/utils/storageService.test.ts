import { StorageService } from '@/model/utils/storageService';

describe('storageService', () => {
  let storageService: StorageService;
  let storage: jest.Mocked<Storage>;
  const length = 5;
  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: length,
    } as unknown as jest.Mocked<Storage>;
  });
  describe('getItem', () => {
    it('should get item from storage', () => {
      storage.getItem.mockReturnValue('value');
      storageService = new StorageService(storage);
      const result = storageService.getItem('key');
      expect(storage.getItem).toHaveBeenCalledWith('key');
      expect(result).toBe('value');
    });
    it('should return null even if storage throws an error', () => {
      storage.getItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      storageService = new StorageService(storage);
      const result = storageService.getItem('key');
      expect(storage.getItem).toHaveBeenCalledWith('key');
      expect(result).toBeNull();
    });
  });
  describe('setItem', () => {
    it('should set item in storage', () => {
      storageService = new StorageService(storage);
      const result = storageService.setItem('key', 'value');
      expect(storage.setItem).toHaveBeenCalledWith('key', 'value');
      expect(result).toBe(true);
    });
    it('should return false if storage throws QuotaExceededError', () => {
      storage.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      storageService = new StorageService(storage);
      const result = storageService.setItem('key', 'value');
      expect(storage.setItem).not.toHaveBeenCalledWith('key', 'value');
      expect(result).toBeFalsy();
    });
    it('should return false if storage throws NS_ERROR_DOM_QUOTA_REACHED', () => {
      storage.setItem.mockImplementation(() => {
        throw new DOMException('NS_ERROR_DOM_QUOTA_REACHED');
      });
      storageService = new StorageService(storage);
      const result = storageService.setItem('key', 'value');
      expect(storage.setItem).not.toHaveBeenCalledWith('key', 'value');
      expect(result).toBeFalsy();
    });
  });
  describe('removeItem', () => {
    it('should remove item from storage', () => {
      storageService = new StorageService(storage);
      storageService.removeItem('key');
      expect(storage.removeItem).toHaveBeenCalledWith('key');
    });
    it('should not propagate an exception even if storage throws an error', () => {
      storage.getItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      storageService = new StorageService(storage);
      storageService.removeItem('key');
      expect(storage.removeItem).toHaveBeenCalledWith('key');
    });
  });
  describe('isStorageAvailable', () => {
    it('should return true if storage is available', () => {
      storageService = new StorageService(storage);
      const result = storageService.isStorageAvailable();
      expect(result).toBeTruthy();
    });
    it('should return false if storage throws QuotaExceededError', () => {
      storage.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      storageService = new StorageService(storage);
      const result = storageService.isStorageAvailable();
      expect(result).toBeFalsy();
    });
    it('should return false if storage throws NS_ERROR_DOM_QUOTA_REACHED', () => {
      storage.setItem.mockImplementation(() => {
        throw new DOMException('NS_ERROR_DOM_QUOTA_REACHED');
      });
      storageService = new StorageService(storage);
      const result = storageService.isStorageAvailable();
      expect(result).toBeFalsy();
    });
  });
  describe('length', () => {
    it('should return length of storage', () => {
      storageService = new StorageService(storage);
      const result = storageService.length;
      expect(result).toBe(length);
    });
  });
});
