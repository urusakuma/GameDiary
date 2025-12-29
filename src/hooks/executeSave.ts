import { IDiarySaveHandler } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const executeSave = async () => {
  const isSaved = container
    .resolve<IDiarySaveHandler>('IDiarySaveHandler')
    .save();
  if (isSaved) {
    toast.success('セーブしました');
  } else {
    toast.error('セーブできませんでした');
  }
};
export default executeSave;
