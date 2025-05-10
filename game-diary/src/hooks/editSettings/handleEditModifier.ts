import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const handleEditModifier = (name: string) => {
  const editDiarySettings =
    container.resolve<IEditDiarySettings>('IEditDiarySettings');
  editDiarySettings.editModifier(name);
};

export default handleEditModifier;
