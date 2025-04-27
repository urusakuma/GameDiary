import { IEditDiaryEntry } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const handleEditTitle = (title: string) => {
  const editDiaryEntry = container.resolve<IEditDiaryEntry>('IEditDiaryEntry');
  editDiaryEntry.editTitle(title);
};

export default handleEditTitle;
