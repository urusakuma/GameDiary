import 'reflect-metadata';
import EditDiaryEntry from '@features/diary/control/diaryEntry/useCases/editDiaryEntry';
import type { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import type {
  ICurrentDiaryEntryAccessor,
  IEditDiaryEntry,
} from '../../control/diaryEntry/controlDiaryEntryInterface';
import {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';

describe('EditDiaryEntry', () => {
  let editDiaryEntry: IEditDiaryEntry;
  let mockDiaryEntryAccessor: jest.Mocked<ICurrentDiaryEntryAccessor>;
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;

  beforeEach(() => {
    mockDiaryEntryAccessor = {
      getCurrentDiaryEntry: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryEntryAccessor>;

    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    const mockDiaryEntry = {
      setTitle: jest.fn(),
      setContent: jest.fn(),
      day: 1,
    } as unknown as jest.Mocked<IDiaryEntry>;

    const mockDiary = {
      getSettings: jest.fn(),
    } as unknown as jest.Mocked<IDiary>;

    const mockSettings = {
      getModifierDay: jest.fn().mockReturnValue('Default Title'),
    } as unknown as jest.Mocked<IDiarySettings>;

    mockDiaryEntryAccessor.getCurrentDiaryEntry.mockReturnValue(mockDiaryEntry);
    mockDiaryAccessor.getCurrentDiary.mockReturnValue(mockDiary);
    mockDiary.getSettings.mockReturnValue(mockSettings);

    editDiaryEntry = new EditDiaryEntry(
      mockDiaryEntryAccessor,
      mockDiaryAccessor
    );
  });

  it('should edit the title of the diary entry', () => {
    const newTitle = 'New Title';
    editDiaryEntry.editTitle(newTitle);

    expect(
      mockDiaryEntryAccessor.getCurrentDiaryEntry().setTitle
    ).toHaveBeenCalledWith(newTitle);
  });

  it('should edit the content of the diary entry', () => {
    const newContent = 'New Content';
    editDiaryEntry.editContent(newContent);

    expect(
      mockDiaryEntryAccessor.getCurrentDiaryEntry().setContent
    ).toHaveBeenCalledWith(newContent);
  });

  it('should clear the diary entry', () => {
    editDiaryEntry.clear();

    const mockEntry = mockDiaryEntryAccessor.getCurrentDiaryEntry();
    const mockSettings = mockDiaryAccessor.getCurrentDiary().getSettings();

    expect(mockSettings.getModifierDay).toHaveBeenCalledWith(mockEntry.day);
    expect(mockEntry.setTitle).toHaveBeenCalledWith('Default Title');
    expect(mockEntry.setContent).toHaveBeenCalledWith('');
  });
});
