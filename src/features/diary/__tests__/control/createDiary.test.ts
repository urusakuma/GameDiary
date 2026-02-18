import 'reflect-metadata';
import CreateDiary from '@features/diary/control/diary/useCases/createDiary';
import type { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import type { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import { MockDiary } from '@features/diary/__tests__/__mocks__/mockDiary';
import { IDiaryFactory } from '@features/diary/model/diaryModelInterfaces';

describe('CreateDiary', () => {
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let mockDiaryFactory: jest.Mocked<IDiaryFactory>;
  let mockDiaryService: jest.Mocked<IDiaryService>;
  let createDiary: CreateDiary;

  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
      setCurrentDiary: jest.fn(),
    };

    mockDiaryFactory = {
      createNewDiary: jest.fn(),
    } as unknown as jest.Mocked<IDiaryFactory>;

    mockDiaryService = {
      addDiary: jest.fn(),
      getDiary: jest.fn(),
      deleteDiary: jest.fn(),
    };

    createDiary = new CreateDiary(
      mockDiaryAccessor,
      mockDiaryFactory,
      mockDiaryService
    );
  });

  it('should create a new diary and update the current diary', () => {
    const oldDiary = new MockDiary();
    const newDiary = new MockDiary('new-diary-key');

    mockDiaryAccessor.getCurrentDiary.mockReturnValue(oldDiary);
    mockDiaryFactory.createNewDiary.mockReturnValue(newDiary);

    createDiary.create();

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryFactory.createNewDiary).toHaveBeenCalledWith(oldDiary);
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(newDiary);
    expect(mockDiaryAccessor.setCurrentDiary).toHaveBeenCalledWith(
      'new-diary-key'
    );
  });
});
