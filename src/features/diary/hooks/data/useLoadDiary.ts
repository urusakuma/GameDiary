'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';

import { IDiaryLoadHandler } from '@features/diary/control/diary/controlDiaryInterface';

import useRefreshCurrentDiary from './useRefreshCurrentDiary';

const useLoadDiary = () => {
  const [diaryLoadHandler, setDiaryLoadHandler] = useState<IDiaryLoadHandler>();
  const { refreshCurrentDiary } = useRefreshCurrentDiary();
  useEffect(() => {
    const diaryLoadHandlerInstance =
      container.resolve<IDiaryLoadHandler>('IDiaryLoadHandler');
    setDiaryLoadHandler(diaryLoadHandlerInstance);
  }, []);
  const load = async (key: string) => {
    if (diaryLoadHandler === undefined) {
      return;
    }
    try {
      diaryLoadHandler.load(key);
      refreshCurrentDiary();
      toast.success('ロードしました');
    } catch (e) {
      toast.error('日記が存在しません');
    }
  };
  return { load };
};
export default useLoadDiary;
