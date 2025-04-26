import { IDiaryLoadHandler } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const handleLoad = async (key: string) => {
  try {
    container.resolve<IDiaryLoadHandler>('DiaryLoadHandler').load(key);
    toast.success('ロードしました');
  } catch (err) {
    toast.error('日記が存在しません');
  }
};
export default handleLoad;
