import 'reflect-metadata';
import { container } from 'tsyringe';
import CurrentDiaryAccessor from '@/control/controlDiary/currentDiaryAccessor';
import type {
  ICurrentDiaryManager,
  IDiaryService,
} from '@/model/repository/diaryRepositoryInterfaces';
import { MockDiary } from '../__mocks__/mockDiary';
import { NotFoundError } from '@/error';

describe('CurrentDiaryAccessor Constructor', () => {
  let mockCurrentDiaryManager: ICurrentDiaryManager;
  let mockDiaryService: IDiaryService;
  const diary = new MockDiary();
  const key = 'testKey';
  beforeEach(() => {
    mockCurrentDiaryManager = {
      getCurrentDiaryKey: jest.fn(),
      setCurrentDiaryKey: jest.fn(),
    };
    mockDiaryService = {
      getDiary: jest.fn(),
      addDiary: jest.fn(),
      deleteDiary: jest.fn(),
    };

    container.registerInstance('ICurrentDiaryManager', mockCurrentDiaryManager);
    container.registerInstance('IDiaryService', mockDiaryService);
  });

  it('should retrieve the current diary successfully', () => {
    (mockCurrentDiaryManager.getCurrentDiaryKey as jest.Mock).mockReturnValue(
      key
    );
    (mockDiaryService.getDiary as jest.Mock).mockReturnValue(diary);
    const accessor = container.resolve(CurrentDiaryAccessor);
    expect(accessor.getCurrentDiary()).toBe(diary);
    expect(mockCurrentDiaryManager.getCurrentDiaryKey).toHaveBeenCalled();
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(key);
  });
  it('should return undefined when the current diary is not found', () => {
    (mockCurrentDiaryManager.getCurrentDiaryKey as jest.Mock).mockReturnValue(
      key
    );
    (mockDiaryService.getDiary as jest.Mock).mockReturnValue(undefined);
    const accessor = container.resolve(CurrentDiaryAccessor);
    expect(() => accessor.getCurrentDiary()).toThrow(
      new NotFoundError('current diary is not found')
    );
    expect(mockCurrentDiaryManager.getCurrentDiaryKey).toHaveBeenCalled();
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(key);
  });
  it('should set the current diary successfully', () => {
    (mockCurrentDiaryManager.getCurrentDiaryKey as jest.Mock).mockReturnValue(
      key
    );
    (mockDiaryService.getDiary as jest.Mock).mockReturnValue(diary);
    const accessor = container.resolve(CurrentDiaryAccessor);
    accessor.setCurrentDiary(key);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(key);
    expect(mockCurrentDiaryManager.setCurrentDiaryKey).toHaveBeenCalledWith(
      key
    );
  });
  it('should not set the current diary when the diary is not found', () => {
    (mockCurrentDiaryManager.getCurrentDiaryKey as jest.Mock).mockReturnValue(
      key
    );
    (mockDiaryService.getDiary as jest.Mock).mockReturnValue(undefined);
    const accessor = container.resolve(CurrentDiaryAccessor);
    accessor.setCurrentDiary(key);
    expect(mockDiaryService.getDiary).toHaveBeenCalledWith(key);
    expect(mockCurrentDiaryManager.setCurrentDiaryKey).not.toHaveBeenCalled();
  });
});
