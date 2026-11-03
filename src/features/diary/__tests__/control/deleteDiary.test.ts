import 'reflect-metadata';
import DeleteDiary from '@features/diary/control/diary/useCases/deleteDiary';
import { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';

import { ICurrentDiaryManager } from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import { IDiaryNameService } from '@features/diary/control/diary/controlDiaryInterface';

describe('DeleteDiary', () => {
  let deleteDiary: DeleteDiary;
  let mockCurrentDiaryManager: jest.Mocked<ICurrentDiaryManager>;
  let mockDiaryService: jest.Mocked<IDiaryService>;

  let names: jest.Mocked<IDiaryNameService>;
  beforeEach(() => {
    mockCurrentDiaryManager = {
      getCurrentDiaryKey: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryManager>;

    mockDiaryService = {
      deleteDiary: jest.fn(),
    } as unknown as jest.Mocked<IDiaryService>;

    names = {
      removeDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiaryNameService>;
    deleteDiary = new DeleteDiary(
      mockCurrentDiaryManager,
      mockDiaryService,
      names
    );
  });

  it('should return false if the key matches the current diary key', () => {
    const key = 'diary1';
    mockCurrentDiaryManager.getCurrentDiaryKey.mockReturnValue(key);

    const result = deleteDiary.delete(key);

    expect(result).toBe(false);
    expect(mockDiaryService.deleteDiary).not.toHaveBeenCalled();
    expect(names.removeDiaryName).not.toHaveBeenCalled();
  });

  it('should delete the diary and return true if the key does not match the current diary key', () => {
    const currentKey = 'diary1';
    const keyToDelete = 'diary2';
    mockCurrentDiaryManager.getCurrentDiaryKey.mockReturnValue(currentKey);

    const result = deleteDiary.delete(keyToDelete);

    expect(result).toBe(true);
    expect(mockDiaryService.deleteDiary).toHaveBeenCalledWith(keyToDelete);
    expect(names.removeDiaryName).toHaveBeenCalledWith(keyToDelete);
  });
});
