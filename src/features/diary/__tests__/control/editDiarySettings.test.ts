import 'reflect-metadata';
import EditDiarySettings from '@features/diary/control/diary/useCases/editDiarySettings';
import type {
  ICurrentDiaryAccessor,
  IDiaryNameService,
} from '@features/diary/control/diary/controlDiaryInterface';
import {
  IDiary,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';

describe('EditDiarySettings', () => {
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let editDiarySettings: EditDiarySettings;
  let mockSettings: jest.Mocked<IDiarySettings>;

  let names: jest.Mocked<IDiaryNameService>;
  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    mockSettings = {
      storageKey: 'diary-key',
      setDiaryName: jest.fn(),
      updateDayInterval: jest.fn(),
      setModifier: jest.fn(),
      updateModifierUnit: jest.fn(),
      updateCycleLength: jest.fn(),
    } as unknown as jest.Mocked<IDiarySettings>;

    mockDiaryAccessor.getCurrentDiary.mockReturnValue({
      getSettings: jest.fn().mockReturnValue(mockSettings),
    } as unknown as jest.Mocked<IDiary>);

    names = {
      updateDiaryName: jest.fn().mockReturnValue('unique name'),
    } as unknown as jest.Mocked<IDiaryNameService>;
    editDiarySettings = new EditDiarySettings(mockDiaryAccessor, names);
  });

  it('should call setDiaryName with the correct arguments', () => {
    const name = 'name';
    editDiarySettings.editDiaryName(name);
    expect(names.updateDiaryName).toHaveBeenCalledWith('diary-key', name);
    expect(mockSettings.setDiaryName).toHaveBeenCalledWith('unique name');
  });
  it('should call updateDayInterval with the correct arguments', () => {
    const interval = 3;
    editDiarySettings.editDayInterval(interval);
    expect(mockSettings.updateDayInterval).toHaveBeenCalledWith(interval);
  });
  it('should update the day modifier', () => {
    const modifier = '日目';
    editDiarySettings.editModifier(modifier);
    expect(mockSettings.setModifier).toHaveBeenCalledWith(modifier);
  });
  it('should call updateModifierUnit with the correct arguments', () => {
    const cycle = 0;
    const cycleModifier = '春';

    editDiarySettings.editModifierCycle(cycle, cycleModifier);
    expect(mockSettings.updateModifierUnit).toHaveBeenCalledWith(
      cycleModifier,
      cycle
    );
  });
  it('should update the cycle length', () => {
    const len = 15;
    editDiarySettings.editCycleLength(len);
    expect(mockSettings.updateCycleLength).toHaveBeenCalledWith(len);
  });
});
