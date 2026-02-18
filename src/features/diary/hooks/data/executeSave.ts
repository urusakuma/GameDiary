import toast from 'react-hot-toast';
import { container } from 'tsyringe';

import { IDiarySaveHandler } from '@features/diary/control/diary/controlDiaryInterface';

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
