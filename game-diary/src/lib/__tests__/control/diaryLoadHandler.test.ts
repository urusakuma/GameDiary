import 'reflect-metadata';
import { IDiaryLoad } from '@/model/repository/diaryRepositoryInterfaces';
import { ICurrentDiaryAccessor } from '@/control/controlInterface';
import { MockDiary } from '../__mocks__/mockDiary';
import DiaryLoadHandler from '@/control/diaryLoadHandler';
import { IDiary } from '@/model/diary/diaryModelInterfaces';

describe('DiaryLoadHandler', () => {
  let diaryLoadHandler: DiaryLoadHandler;
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let mockDiaryLoad: jest.Mocked<IDiaryLoad>;
  const diary = new MockDiary();
  const key = diary.getSettings().storageKey;
  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
      setCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    mockDiaryLoad = {
      load: jest.fn(),
    } as unknown as jest.Mocked<IDiaryLoad>;

    diaryLoadHandler = new DiaryLoadHandler(mockDiaryLoad, mockDiaryAccessor);
  });

  it('should load the new diary if the current diary has a different key', () => {
    mockDiaryAccessor.getCurrentDiary.mockReturnValue({
      getSettings: jest
        .fn()
        .mockReturnValue({ storageKey: jest.fn().mockReturnValue('testKey') }),
    } as unknown as jest.Mocked<IDiary>);

    diaryLoadHandler.load(key);

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryAccessor.setCurrentDiary).toHaveBeenCalledWith(key);
    expect(mockDiaryLoad.load).toHaveBeenCalledWith(key);
  });

  it('should load the new diary if no current diary exists', () => {
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(undefined);
    diaryLoadHandler.load(key);

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryAccessor.setCurrentDiary).toHaveBeenCalledWith(key);
    expect(mockDiaryLoad.load).toHaveBeenCalledWith(key);
  });
  it('should not reload the diary if it is already loaded', () => {
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(diary);
    diaryLoadHandler.load(key);

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryAccessor.setCurrentDiary).not.toHaveBeenCalled();
    expect(mockDiaryLoad.load).not.toHaveBeenCalled();
  });
});
