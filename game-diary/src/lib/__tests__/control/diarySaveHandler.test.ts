import 'reflect-metadata';
import { IDiarySave } from '@/model/repository/diaryRepositoryInterfaces';
import DiarySaveHandler from '@/control/diarySaveHandler';
import { ICurrentDiaryAccessor } from '@/control/controlInterface';
import { MockDiary } from '../__mocks__/mockDiary';

describe('DiarySaveHandler', () => {
  let diarySaveHandler: DiarySaveHandler;
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let mockDiarySave: jest.Mocked<IDiarySave>;
  let mockDiary = new MockDiary();
  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    mockDiarySave = {
      save: jest.fn(),
    } as unknown as jest.Mocked<IDiarySave>;

    diarySaveHandler = new DiarySaveHandler(mockDiarySave, mockDiaryAccessor);
  });

  it('should save the diary if it matches the current diary key', () => {
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(mockDiary);

    diarySaveHandler.save();

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalledWith();
    expect(mockDiarySave.save).toHaveBeenCalledWith(mockDiary);
  });
});
