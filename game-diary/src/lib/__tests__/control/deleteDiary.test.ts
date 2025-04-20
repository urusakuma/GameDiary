import 'reflect-metadata';
import DeleteDiary from '@/control/controlDiary/deleteDiary';
import {
  ICurrentDiaryManager,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';

describe('DeleteDiary', () => {
  let deleteDiary: DeleteDiary;
  let mockCurrentDiaryManager: jest.Mocked<ICurrentDiaryManager>;
  let mockDiaryService: jest.Mocked<IDiaryService>;

  beforeEach(() => {
    mockCurrentDiaryManager = {
      getCurrentDiaryKey: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryManager>;

    mockDiaryService = {
      deleteDiary: jest.fn(),
    } as unknown as jest.Mocked<IDiaryService>;

    deleteDiary = new DeleteDiary(mockCurrentDiaryManager, mockDiaryService);
  });

  it('should return false if the key matches the current diary key', () => {
    const key = 'diary1';
    mockCurrentDiaryManager.getCurrentDiaryKey.mockReturnValue(key);

    const result = deleteDiary.delete(key);

    expect(result).toBe(false);
    expect(mockDiaryService.deleteDiary).not.toHaveBeenCalled();
  });

  it('should delete the diary and return true if the key does not match the current diary key', () => {
    const currentKey = 'diary1';
    const keyToDelete = 'diary2';
    mockCurrentDiaryManager.getCurrentDiaryKey.mockReturnValue(currentKey);

    const result = deleteDiary.delete(keyToDelete);

    expect(result).toBe(true);
    expect(mockDiaryService.deleteDiary).toHaveBeenCalledWith(keyToDelete);
  });
});
