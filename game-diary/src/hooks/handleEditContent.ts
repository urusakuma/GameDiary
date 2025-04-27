import { IEditDiaryEntry } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const handleEditContent = (content: string) => {
  const editDiaryEntry = container.resolve<IEditDiaryEntry>('IEditDiaryEntry');
  editDiaryEntry.editContent(content);
};

export default handleEditContent;
