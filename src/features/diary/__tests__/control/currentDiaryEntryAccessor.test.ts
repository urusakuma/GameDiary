import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import CurrentDiaryEntryAccessor from '@features/diary/control/diaryEntry/accessors/currentDiaryEntryAccessor';
import { IDiary } from '@features/diary/model/diaryModelInterfaces';
import DiaryEntry from '@features/diary/model/diaryEntry';

describe('CurrentDiaryEntryAccessor', () => {
  let diaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let accessor: CurrentDiaryEntryAccessor;
  let diary: jest.Mocked<IDiary>;
  let entries: DiaryEntry[];

  beforeEach(() => {
    entries = [1, 2, 3].map(
      (day) => new DiaryEntry(day, '', '', undefined, undefined)
    );
    diary = {
      getEntry: jest.fn((day: number) => entries[day - 1]),
      getLastDay: jest.fn().mockReturnValue(3),
    } as unknown as jest.Mocked<IDiary>;
    diaryAccessor = {
      getCurrentDiary: jest.fn().mockReturnValue(diary),
      setCurrentDiary: jest.fn(),
    };
    accessor = new CurrentDiaryEntryAccessor(diaryAccessor);
  });

  it('defers diary access until an entry is requested', () => {
    expect(diaryAccessor.getCurrentDiary).not.toHaveBeenCalled();
    expect(diary.getEntry).not.toHaveBeenCalled();
  });

  it('loads the last entry once and reuses it', () => {
    expect(accessor.getCurrentDiaryEntry()).toBe(entries[2]);
    expect(accessor.getCurrentDiaryEntry()).toBe(entries[2]);
    expect(diaryAccessor.getCurrentDiary).toHaveBeenCalledTimes(1);
    expect(diary.getLastDay).toHaveBeenCalledTimes(1);
    expect(diary.getEntry).toHaveBeenCalledTimes(1);
    expect(diary.getEntry).toHaveBeenCalledWith(3);
  });

  it('uses the explicitly selected entry before the first read', () => {
    accessor.setCurrentDiaryEntry(2);
    expect(accessor.getCurrentDiaryEntry()).toBe(entries[1]);
    expect(diary.getEntry).toHaveBeenCalledWith(2);
    expect(diary.getLastDay).not.toHaveBeenCalled();
  });

  it('replaces a cached entry when another entry is selected', () => {
    accessor.getCurrentDiaryEntry();
    accessor.setCurrentDiaryEntry(1);
    expect(accessor.getCurrentDiaryEntry()).toBe(entries[0]);
    expect(diary.getEntry).toHaveBeenLastCalledWith(1);
  });
});
