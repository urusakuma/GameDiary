import { IDiaryExporter } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const handleCopy = async () => {
  try {
    const exportText = container
      .resolve<IDiaryExporter>('IDiaryExporter')
      .exportText();
    await navigator.clipboard.writeText(exportText);
    toast.success('クリップボードにコピーしました！');
  } catch (err) {
    toast.error('コピーに失敗しました');
  }
};
export default handleCopy;
