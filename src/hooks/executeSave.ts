import { IDiarySaveHandler } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const executeSave = async () => {
  try {
    container.resolve<IDiarySaveHandler>('IDiarySaveHandler').save();
    toast.success('セーブしました');
  } catch (err) {
    toast.error('セーブできませんでした');
    throw err;
  }
};
export default executeSave;
