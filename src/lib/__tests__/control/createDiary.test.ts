import 'reflect-metadata';
import CreateDiary from '@/control/controlDiary/createDiary';
import type { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import type { IDiaryService } from '@/model/repository/diaryRepositoryInterfaces';
import { MockDiary } from '../__mocks__/mockDiary';
import { IDiaryFactory } from '@/model/diary/diaryModelInterfaces';

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
