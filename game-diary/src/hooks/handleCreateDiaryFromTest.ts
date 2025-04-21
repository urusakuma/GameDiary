import { IDiaryImporter } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const handleCreateDiaryFromTest = (val: string) => {
  if (val === '') {
    return;
  }
  try {
    container.resolve<IDiaryImporter>('IDiaryImporter').importText(val);
  } catch (err) {
    toast.error('テキストの読み込みに失敗しました');
  }
};
export default handleCreateDiaryFromTest;
