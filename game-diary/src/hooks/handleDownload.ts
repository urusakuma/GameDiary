import { IDiaryExporter } from '@/control/controlDiary/controlDiaryInterface';
import { container } from 'tsyringe';

const handleDownload = () => {
  const [blob, fileName] = container
    .resolve<IDiaryExporter>('IDiaryExporter')
    .exportFile();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
export default handleDownload;
