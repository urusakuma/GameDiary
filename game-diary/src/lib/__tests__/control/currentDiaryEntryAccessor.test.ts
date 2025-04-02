import type { ICurrentDiaryAccessor } from '../../control/controlInterface';
import CurrentDiaryEntryAccessor from '@/control/currentDiaryEntryAccessor';
import { IDiary, IDiaryEntry } from '@/model/diary/diaryModelInterfaces';

describe('CurrentDiaryEntryAccessor', () => {
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let currentEntryAccessor: CurrentDiaryEntryAccessor;
  let mockEntries: jest.Mocked<IDiaryEntry>[];
  let diary: jest.Mocked<IDiary>;
  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;
    mockEntries = new Array(3).fill('').map((_, i) => {
      return {
        day: Number(i) + 1,
      } as unknown as jest.Mocked<IDiaryEntry>;
    });
    diary = {
      getEntry: jest
        .fn()
        .mockReturnValueOnce(mockEntries[2])
        .mockReturnValueOnce(mockEntries[1])
        .mockReturnValueOnce(mockEntries[0]),
      getLastDay: jest.fn().mockReturnValue(3),
    } as unknown as jest.Mocked<IDiary>;
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(diary);
    currentEntryAccessor = new CurrentDiaryEntryAccessor(mockDiaryAccessor);
  });

  it('', () => {
    new CurrentDiaryEntryAccessor(mockDiaryAccessor);
    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(diary.getLastDay).toHaveBeenCalled();
    expect(diary.getEntry).toHaveBeenCalled();
  });
  it('', () => {
    const entry = currentEntryAccessor.getCurrentDiaryEntry();
    expect(entry.day).toBe(3);
    const entry1 = currentEntryAccessor.getCurrentDiaryEntry();
    expect(entry1.day).toBe(3);
    expect(mockDiaryAccessor.getCurrentDiary.call.length).toBe(1);
  });
  it('', () => {
    currentEntryAccessor.setCurrentDiaryEntry(2);
    const entry = currentEntryAccessor.getCurrentDiaryEntry();
    expect(entry.day).toBe(2);

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalledWith();
    expect(diary.getEntry).toHaveBeenCalledWith(2);
  });
});
