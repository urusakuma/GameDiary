import CurrentDiaryAccessor from '@features/diary/control/diary/accessors/currentDiaryAccessor';
import {
  ICurrentDiaryManager,
  IDiaryLoad,
} from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import { KeyNotFoundError } from '@lib/error';
import { MockDiary } from '../__mocks__/mockDiary';

describe('CurrentDiaryAccessor', () => {
  let manager: jest.Mocked<ICurrentDiaryManager>;
  let loader: jest.Mocked<IDiaryLoad>;
  let accessor: CurrentDiaryAccessor;
  const diary = new MockDiary();

  beforeEach(() => {
    manager = {
      getCurrentDiaryKey: jest.fn().mockReturnValue('current-key'),
      setCurrentDiaryKey: jest.fn(),
    };
    loader = { load: jest.fn().mockReturnValue(diary) };
    accessor = new CurrentDiaryAccessor(manager, loader);
  });

  it('loads the diary selected by the current key', () => {
    expect(accessor.getCurrentDiary()).toBe(diary);
    expect(manager.getCurrentDiaryKey).toHaveBeenCalledTimes(1);
    expect(loader.load).toHaveBeenCalledWith('current-key');
  });

  it('propagates a failure to load the current diary', () => {
    const error = new KeyNotFoundError('missing diary');
    loader.load.mockImplementation(() => {
      throw error;
    });
    expect(() => accessor.getCurrentDiary()).toThrow(error);
  });

  it('loads the selected diary before updating the current key', () => {
    accessor.setCurrentDiary('new-key');
    expect(loader.load).toHaveBeenCalledWith('new-key');
    expect(manager.setCurrentDiaryKey).toHaveBeenCalledWith('new-key');
    expect(loader.load.mock.invocationCallOrder[0]).toBeLessThan(
      manager.setCurrentDiaryKey.mock.invocationCallOrder[0]
    );
  });

  it('keeps the current key unchanged when loading the selected diary fails', () => {
    const error = new KeyNotFoundError('missing diary');
    loader.load.mockImplementation(() => {
      throw error;
    });
    expect(() => accessor.setCurrentDiary('missing-key')).toThrow(error);
    expect(manager.setCurrentDiaryKey).not.toHaveBeenCalled();
  });
});
