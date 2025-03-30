import 'reflect-metadata';
import CreateDiary from '../../control/createDiary';
import type { ICurrentDiaryAccessor } from '../../control/controlInterface';

import type {
  IDiaryFactory,
  IDiaryService,
} from '../../model/repository/diaryRepositoryInterfaces';
import { MockDiary } from '../__mocks__/mockDiary';

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
      create: jest.fn(),
    };

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
    mockDiaryFactory.create.mockReturnValue(newDiary);

    createDiary.create();

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryFactory.create).toHaveBeenCalledWith(oldDiary);
    expect(mockDiaryService.addDiary).toHaveBeenCalledWith(newDiary);
    expect(mockDiaryAccessor.setCurrentDiary).toHaveBeenCalledWith(
      'new-diary-key'
    );
  });
});
