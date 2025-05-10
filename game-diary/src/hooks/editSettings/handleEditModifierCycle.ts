import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const handleEditModifierCycle = (cycle: number, name: string) => {
  const editDiarySettings =
    container.resolve<IEditDiarySettings>('IEditDiarySettings');
  editDiarySettings.editModifierCycle(cycle, name);
};

export default handleEditModifierCycle;
