import 'reflect-metadata';
import { IDiarySave } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import DiarySaveHandler from '@features/diary/control/diary/useCases/diarySaveHandler';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { MockDiary } from '@features/diary/__tests__/__mocks__/mockDiary';

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
