'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

import { IDiaryImporter } from '@features/diary/control/diary/controlDiaryInterface';
import useRefreshCurrentDiary from '@features/diary/hooks/data/useRefreshCurrentDiary';

const useImportDiary = () => {
  const [diaryImporter, setDiaryImporter] = useState<IDiaryImporter>();
  const { refreshCurrentDiary } = useRefreshCurrentDiary();

  useEffect(() => {
    const diaryImporterInstance =
      container.resolve<IDiaryImporter>('IDiaryImporter');
    setDiaryImporter(diaryImporterInstance);
  }, []);
  const importFromText = (text: string) => {
    if (text === '' || diaryImporter === undefined) {
      return;
    }
    const func = () => diaryImporter.importText(text);
    importDiary(func, 'テキスト');
  };
  const importFromFile = (file: File | undefined) => {
    if (file === undefined || diaryImporter === undefined) {
      return;
    }
    const func = () => diaryImporter.importFile(file);
    importDiary(func, 'ファイル');
  };
  const importDiary = async (func: () => void, type: string) => {
    try {
      await func();
      refreshCurrentDiary();
      toast.success(`${type}の読み込みに成功しました`);
    } catch (e) {
      toast.error(`${type}の読み込みに失敗しました`);
    }
  };
  return { importFromText, importFromFile };
};

export default useImportDiary;
