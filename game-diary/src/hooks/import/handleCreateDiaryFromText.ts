import { IDiaryImporter } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const handleCreateDiaryFromText = (val: string) => {
  if (val === '') {
    return;
  }
  try {
    container.resolve<IDiaryImporter>('IDiaryImporter').importText(val);
  } catch (err) {
    toast.error('テキストの読み込みに失敗しました');
    throw err;
  }
};
export default handleCreateDiaryFromText;
