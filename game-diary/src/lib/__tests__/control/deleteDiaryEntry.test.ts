import 'reflect-metadata';
import DeleteDiaryEntry from '@/control/controlDiaryEntry/deleteDiaryEntry';
import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';

describe('DeleteDiary', () => {
  let deleteDiaryEntry: DeleteDiaryEntry;
  let mockCurrentDiaryManager: jest.Mocked<ICurrentDiaryAccessor>;

  beforeEach(() => {
    mockCurrentDiaryManager = {
      getCurrentDiary: jest.fn().mockReturnValue({
        deleteEntry: jest.fn(),
      }),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    deleteDiaryEntry = new DeleteDiaryEntry(mockCurrentDiaryManager);
  });

  it('should delete entry with given day via current diary', () => {
    deleteDiaryEntry.delete(2);
    expect(mockCurrentDiaryManager.getCurrentDiary).toHaveBeenCalled();
    expect(
      mockCurrentDiaryManager.getCurrentDiary().deleteEntry
    ).toHaveBeenCalledWith(2);
  });
});
