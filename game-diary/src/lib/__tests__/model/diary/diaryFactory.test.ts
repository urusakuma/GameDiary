import 'reflect-metadata';
import { container } from 'tsyringe';
import DiaryFactory from '@/model/repository/diaryFactory';
import Diary from '@/model/diary/diary';
import type {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
  NewDiarySettingsFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';

describe('DiaryFactory', () => {
  let mockNewEntriesFactory: jest.Mock<() => Map<number, IDiaryEntry>>;
  let mockSettingsFactory: jest.Mock<NewDiarySettingsFactory>;
  let mockBuilder: UsePreviousDayDiaryEntryFactory;
  let diaryFactory: DiaryFactory;
  const mockEntries = new Map<number, IDiaryEntry>().set(1, {} as IDiaryEntry);
  const mockSettings = {} as unknown as IDiarySettings;
  const mockEntry = {} as unknown as UsePreviousDayDiaryEntryFactory;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNewEntriesFactory?.mockClear();
    mockSettingsFactory?.mockClear();
    mockBuilder = jest.fn()?.mockClear();
    mockNewEntriesFactory = jest.fn().mockReturnValue(mockEntries);
    mockSettingsFactory = jest.fn().mockReturnValue(mockSettings);
    mockBuilder = jest.fn().mockReturnValue(mockEntry);

    container.register('NewDiaryEntriesFactory', {
      useValue: mockNewEntriesFactory,
    });
    container.register('NewDiarySettingsFactory', {
      useValue: mockSettingsFactory,
    });
    container.register('UsePreviousDayDiaryEntryFactory', {
      useValue: mockBuilder,
    });

    diaryFactory = container.resolve(DiaryFactory);
  });

  it('should create a new Diary when no diary is provided', () => {
    const result = diaryFactory.createNewDiary();

    expect(mockNewEntriesFactory).toHaveBeenCalledTimes(1);
    expect(mockSettingsFactory).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Diary);
    expect(result).toEqual(
      new Diary(mockBuilder, mockEntries, mockSettings, 1)
    );
  });

  it('should create a new Diary with existing diary settings when a diary is provided', () => {
    const mockDiary = {
      getSettings: jest.fn().mockReturnValue(mockSettings),
    } as unknown as IDiary;

    const result = diaryFactory.createNewDiary(mockDiary);

    expect(mockNewEntriesFactory).toHaveBeenCalledTimes(1);
    expect(mockDiary.getSettings).toHaveBeenCalledTimes(1);
    expect(mockSettingsFactory).toHaveBeenCalledWith(mockDiary.getSettings());
    expect(result).toBeInstanceOf(Diary);
    expect(result).toEqual(
      new Diary(mockBuilder, mockEntries, mockSettings, 1)
    );
  });
});
