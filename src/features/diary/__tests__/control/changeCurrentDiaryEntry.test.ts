import 'reflect-metadata';
import ChangeCurrentDiaryEntry from '@features/diary/control/diaryEntry/useCases/changeCurrentDiaryEntry';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { ICurrentDiaryEntryAccessor } from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';
import {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';

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

  it('should move to diary entry of given date', () => {
    const date = 1;
    changeCurrentDiaryEntry.moveByDate(date);
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      date
    );
  });

  it('should move to next entry if it exists and not create a new one', () => {
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

  it('should create and move to new entry if next entry does not exist', () => {
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

  it('should move to previous entry if it exists and check if current is edited', () => {
    const currentEntry = {
      previous: 1,
      isEdited: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<IDiaryEntry>;
    const diary = {
      getSettings: jest.fn().mockReturnValue({} as unknown as IDiarySettings),
    } as unknown as jest.Mocked<IDiary>;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(diary);

    changeCurrentDiaryEntry.moveToPrevious();

    expect(mockDiaryEntryAccessor.getCurrentDiaryEntry).toHaveBeenCalled();
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      currentEntry.previous
    );
    expect(currentEntry.isEdited).toHaveBeenCalled();
  });

  it('should move to previous entry and delete current if not edited', () => {
    const currentEntry = {
      previous: 1,
      isEdited: jest.fn().mockReturnValue(false),
    } as unknown as jest.Mocked<IDiaryEntry>;
    const diary = {
      getSettings: jest.fn().mockReturnValue({} as unknown as IDiarySettings),
      deleteEntry: jest.fn(),
    } as unknown as jest.Mocked<IDiary>;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(diary);

    changeCurrentDiaryEntry.moveToPrevious();

    expect(mockDiaryEntryAccessor.getCurrentDiaryEntry).toHaveBeenCalled();
    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(
      currentEntry.previous
    );
    expect(currentEntry.isEdited).toHaveBeenCalled();
    expect(diary.deleteEntry).toHaveBeenCalled();
  });

  it('should do nothing if there is no previous entry', () => {
    const currentEntry = {
      previous: undefined,
    } as unknown as jest.Mocked<IDiaryEntry>;
    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(currentEntry);

    changeCurrentDiaryEntry.moveToPrevious();

    expect(mockDiaryEntryAccessor.setCurrentDiaryEntry).not.toHaveBeenCalled();
  });
});
