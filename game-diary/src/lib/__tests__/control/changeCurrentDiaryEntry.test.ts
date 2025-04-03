import 'reflect-metadata';
import ChangeCurrentDiaryEntry from '@/control/controlDiaryEntry/changeCurrentDiaryEntry';
import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import { ICurrentDiaryEntryAccessor } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { IDiary, IDiaryEntry } from '@/model/diary/diaryModelInterfaces';

describe('ChangeCurrentDiaryEntry', () => {
  let changeCurrentDiaryEntry: ChangeCurrentDiaryEntry;
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let mockDiaryEntryAccessor: jest.Mocked<ICurrentDiaryEntryAccessor>;

  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    mockDiaryEntryAccessor = {
      setCurrentDiaryEntry: jest.fn(),
      getCurrentDiaryEntry: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryEntryAccessor>;

    changeCurrentDiaryEntry = new ChangeCurrentDiaryEntry(
      mockDiaryAccessor,
      mockDiaryEntryAccessor
    );
  });

  it('should set the current diary entry by date when moveByDate is called', () => {
    const date = 1;
    changeCurrentDiaryEntry.moveByDate(date);
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      date
    );
  });

  it('should move to the next diary entry if it exists when moveToNext is called', () => {
    const currentEntry = { next: 2 } as unknown as jest.Mocked<IDiaryEntry>;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);
    const diary = {
      createNewEntry: jest.fn().mockReturnValue(2),
    } as unknown as jest.Mocked<IDiary>;
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(diary);
    changeCurrentDiaryEntry.moveToNext();

    expect(mockDiaryEntryAccessor.getCurrentDiaryEntry).toHaveBeenCalled();
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      currentEntry.next
    );
    expect(mockDiaryAccessor.getCurrentDiary).not.toHaveBeenCalled();
  });

  it('should create a new diary entry if no next entry exists when moveToNext is called', () => {
    const currentEntry = {
      next: undefined,
    } as unknown as jest.Mocked<IDiaryEntry>;
    const newEntry = 3;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);
    mockDiaryAccessor.getCurrentDiary.mockReturnValue({
      createNewEntry: jest.fn().mockReturnValue(newEntry),
    } as unknown as jest.Mocked<IDiary>);

    changeCurrentDiaryEntry.moveToNext();

    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      newEntry
    );
  });

  it('should move to the previous diary entry if it exists when moveToPrevious is called', () => {
    const currentEntry = { previous: 1 } as unknown as jest.Mocked<IDiaryEntry>;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);

    changeCurrentDiaryEntry.moveToPrevious();

    expect(mockDiaryEntryAccessor.getCurrentDiaryEntry).toHaveBeenCalled();
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      currentEntry.previous
    );
  });

  it('should do nothing if no previous diary entry exists when moveToPrevious is called', () => {
    const currentEntry = {
      previous: undefined,
    } as unknown as jest.Mocked<IDiaryEntry>;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);

    changeCurrentDiaryEntry.moveToPrevious();

    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).not.toHaveBeenCalled();
  });
});
