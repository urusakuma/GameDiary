import CreateDiary from '@features/diary/control/diary/useCases/createDiary';
import {
  ICurrentDiaryAccessor,
  IDiaryNameService,
} from '@features/diary/control/diary/controlDiaryInterface';
import { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import { IDiaryFactory } from '@features/diary/model/diaryModelInterfaces';
import DiaryEntry from '@features/diary/model/diaryEntry';
import { MockDiary } from '../__mocks__/mockDiary';

describe('CreateDiary', () => {
  let accessor: jest.Mocked<ICurrentDiaryAccessor>;
  let factory: jest.Mocked<IDiaryFactory>;
  let service: jest.Mocked<IDiaryService>;
  let names: jest.Mocked<IDiaryNameService>;
  let createDiary: CreateDiary;
  let newDiary: MockDiary;
  let firstEntry: DiaryEntry;
  const oldDiary = new MockDiary();

  beforeEach(() => {
    accessor = {
      getCurrentDiary: jest.fn().mockReturnValue(oldDiary),
      setCurrentDiary: jest.fn(),
    };
    factory = { createNewDiary: jest.fn(), createUseExistingData: jest.fn() };
    service = {
      addDiary: jest.fn(),
      getDiary: jest.fn(),
      deleteDiary: jest.fn(),
    };
    names = {
      updateDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiaryNameService>;
    firstEntry = new DiaryEntry(1, '', '', undefined, undefined);
    newDiary = new MockDiary('new-diary-key');
    jest.spyOn(newDiary, 'getEntry').mockReturnValue(firstEntry);
    factory.createNewDiary.mockReturnValue(newDiary);
    createDiary = new CreateDiary(accessor, factory, service, names);
  });

  it.each([true, false])(
    'creates and finalizes a diary (use existing settings: %s)',
    (useExisting) => {
      const result = useExisting
        ? createDiary.create('指定した名前')
        : createDiary.createDefaultDiary();
      if (useExisting) {
        expect(factory.createNewDiary).toHaveBeenCalledWith(
          oldDiary,
          '指定した名前'
        );
        expect(accessor.getCurrentDiary).toHaveBeenCalledTimes(1);
      } else {
        expect(factory.createNewDiary).toHaveBeenCalledWith();
        expect(accessor.getCurrentDiary).not.toHaveBeenCalled();
      }
      expect(service.addDiary).toHaveBeenCalledWith(newDiary);
      expect(firstEntry.getTitle()).toBe(
        newDiary.getSettings().getModifierDay(1)
      );
      const name = newDiary.getSettings().getDiaryName();
      expect(names.updateDiaryName).toHaveBeenCalledWith('new-diary-key', name);
      expect(accessor.setCurrentDiary).toHaveBeenCalledWith('new-diary-key');
      expect(result).toEqual({ key: 'new-diary-key', name });
    }
  );
});
