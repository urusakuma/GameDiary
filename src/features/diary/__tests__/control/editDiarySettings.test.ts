import 'reflect-metadata';
import EditDiarySettings from '@features/diary/control/diary/useCases/editDiarySettings';
import type { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import {
  IDiary,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';

describe('EditDiarySettings', () => {
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  let editDiarySettings: EditDiarySettings;
  let mockSettings: jest.Mocked<IDiarySettings>;

  beforeEach(() => {
    mockDiaryAccessor = {
      getCurrentDiary: jest.fn(),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    mockSettings = {
      setDiaryName: jest.fn(),
      updateDayInterval: jest.fn(),
      setModifier: jest.fn(),
      updateModifierUnit: jest.fn(),
      updateCycleLength: jest.fn(),
    } as unknown as jest.Mocked<IDiarySettings>;

    mockDiaryAccessor.getCurrentDiary.mockReturnValue({
      getSettings: jest.fn().mockReturnValue(mockSettings),
    } as unknown as jest.Mocked<IDiary>);

    editDiarySettings = new EditDiarySettings(mockDiaryAccessor);
  });

  it('should call setDiaryName with the correct arguments', () => {
    const name = 'name';
    editDiarySettings.editDiaryName(name);
    expect(mockSettings.setDiaryName).toHaveBeenCalledWith(name);
  });
  it('should call updateDayInterval with the correct arguments', () => {
    const interval = 3;
    editDiarySettings.editDayInterval(interval);
    expect(mockSettings.updateDayInterval).toHaveBeenCalledWith(interval);
  });
  it('should call updateDayInterval with the correct arguments', () => {
    const interval = 3;
    editDiarySettings.editDayInterval(interval);
    expect(mockSettings.updateDayInterval).toHaveBeenCalledWith(interval);
  });
  it('should call updateDayInterval with the correct arguments', () => {
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
  it('should call updateDayInterval with the correct arguments', () => {
    const len = 15;
    editDiarySettings.editCycleLength(len);
    expect(mockSettings.updateCycleLength).toHaveBeenCalledWith(len);
  });
});
