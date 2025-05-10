import { IEditDiaryEntry } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const handleClearDiaryEntry = () => {
  const editDiaryEntry = container.resolve<IEditDiaryEntry>('IEditDiaryEntry');
  editDiaryEntry.clear();
};

export default handleClearDiaryEntry;
