import ChangeCurrentDiaryEntry from '@features/diary/control/diaryEntry/useCases/changeCurrentDiaryEntry';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { ICurrentDiaryEntryAccessor } from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';
import { IDiary } from '@features/diary/model/diaryModelInterfaces';
import DiaryEntry from '@features/diary/model/diaryEntry';

describe('ChangeCurrentDiaryEntry', () => {
  let change: ChangeCurrentDiaryEntry;
  let diary: jest.Mocked<IDiary>;
  let entryAccessor: jest.Mocked<ICurrentDiaryEntryAccessor>;

  beforeEach(() => {
    diary = {
      getNextEntry: jest.fn(),
      getPreviousEntry: jest.fn(),
      createNewEntry: jest.fn(),
      pruneTrailingUneditedEntries: jest.fn(),
    } as unknown as jest.Mocked<IDiary>;
    const diaryAccessor: ICurrentDiaryAccessor = {
      getCurrentDiary: jest.fn().mockReturnValue(diary),
      setCurrentDiary: jest.fn(),
    };
    entryAccessor = {
      setCurrentDiaryEntry: jest.fn(),
      getCurrentDiaryEntry: jest
        .fn()
        .mockReturnValue(new DiaryEntry(4, '', '', 1, undefined)),
    };
    change = new ChangeCurrentDiaryEntry(diaryAccessor, entryAccessor);
  });

  it('moves to a date and delegates trailing-entry cleanup to the diary', () => {
    change.moveByDate(1);
    expect(entryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(1);
    expect(diary.pruneTrailingUneditedEntries).toHaveBeenCalledWith(1);
  });

  it('moves to an existing next entry without creating one', () => {
    diary.getNextEntry.mockReturnValue(new DiaryEntry(7, '', '', 4, undefined));
    change.moveToNext();
    expect(diary.getNextEntry).toHaveBeenCalledWith(4);
    expect(entryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(7);
    expect(diary.createNewEntry).not.toHaveBeenCalled();
  });

  it('creates an entry when the diary has no next entry', () => {
    diary.getNextEntry.mockReturnValue(undefined);
    diary.createNewEntry.mockReturnValue(7);
    change.moveToNext();
    expect(diary.getNextEntry).toHaveBeenCalledWith(4);
    expect(diary.createNewEntry).toHaveBeenCalledTimes(1);
    expect(entryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(7);
  });

  it('moves to the previous entry selected by the diary and prunes trailing entries', () => {
    diary.getPreviousEntry.mockReturnValue(
      new DiaryEntry(1, '', '', undefined, 4)
    );
    change.moveToPrevious();
    expect(diary.getPreviousEntry).toHaveBeenCalledWith(4);
    expect(entryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(1);
    expect(diary.pruneTrailingUneditedEntries).toHaveBeenCalledWith(1);
  });

  it('stays on the first entry when the diary returns it as the previous entry', () => {
    const first = new DiaryEntry(1, '', '', undefined, undefined);
    entryAccessor.getCurrentDiaryEntry.mockReturnValue(first);
    diary.getPreviousEntry.mockReturnValue(first);
    change.moveToPrevious();
    expect(diary.getPreviousEntry).toHaveBeenCalledWith(1);
    expect(entryAccessor.setCurrentDiaryEntry).toHaveBeenCalledWith(1);
    expect(diary.pruneTrailingUneditedEntries).toHaveBeenCalledWith(1);
  });
});
