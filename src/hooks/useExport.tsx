'use client';
import { IDiaryExporter } from '@/control/controlDiary/controlDiaryInterface';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

const useExport = () => {
  const [exportText, setExportText] = useState('');
  const [diaryExporter, setDiaryExporter] = useState<IDiaryExporter>();
  const fileErrorMsg = 'ファイルの出力に失敗しました';
  const copySuccessMsg = 'クリップボードにコピーしました！';
  const copyErrorMsg = 'コピーに失敗しました';

  useEffect(() => {
    const instance = container.resolve<IDiaryExporter>('IDiaryExporter');
    setDiaryExporter(instance);
  }, []);

  const refreshExportText = () => {
    if (diaryExporter === undefined) {
      return;
    }
    const text = diaryExporter.exportText();
    if (text === exportText) {
      return;
    }
    setExportText(text);
  };
  const handleDownload = () => {
    if (diaryExporter === undefined) {
      toast.error(fileErrorMsg);
      return;
    }
    try {
      const { data, fileName } = diaryExporter.exportFile();
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      [a.href, a.download] = [url, fileName];
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(fileErrorMsg);
      throw err;
    }
  };

  const handleCopy = async () => {
    if (diaryExporter === undefined) {
      toast.error(copyErrorMsg);
      return;
    }
    try {
      const exportText = diaryExporter.exportText();
      await navigator.clipboard.writeText(exportText);
      toast.success(copySuccessMsg);
    } catch (err) {
      toast.error(copyErrorMsg);
      throw err;
    }
  };
  return { exportText, refreshExportText, handleCopy, handleDownload };
};
export default useExport;
