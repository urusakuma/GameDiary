import { IDiaryImporter } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const handleCreateDiaryFromTest = (val: File | undefined) => {
  if (val === undefined) {
    return;
  }
  try {
    container.resolve<IDiaryImporter>('IDiaryImporter').importFile(val);
  } catch (err) {
    toast.error('ファイルの読み込みに失敗しました');
    throw err;
  }
};
export default handleCreateDiaryFromTest;
