import { IDiaryExporter } from '@/control/controlDiary/controlDiaryInterface';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const handleDownload = () => {
  try {
    const [blob, fileName] = container
      .resolve<IDiaryExporter>('IDiaryExporter')
      .exportFile();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    toast.error('ファイルの出力に失敗しました');
    throw err;
  }
};
export default handleDownload;
