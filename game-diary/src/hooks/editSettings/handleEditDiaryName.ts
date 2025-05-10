import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const handleEditDiaryName = (name: string) => {
  const editDiarySettings =
    container.resolve<IEditDiarySettings>('IEditDiarySettings');
  editDiarySettings.editDiaryName(name);
};

export default handleEditDiaryName;
