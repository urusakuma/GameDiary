'use client';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { container } from 'tsyringe';

import { ICreateDiary } from '@features/diary/control/diary/controlDiaryInterface';

import useRefreshCurrentDiary from './useRefreshCurrentDiary';

const useCreateDiary = () => {
  const [createDiary, setCreateDiary] = useState<ICreateDiary>();
  const [newDiaryName, setNewDiaryName] = useState('');
  const { refreshCurrentDiary } = useRefreshCurrentDiary();

  useEffect(() => {
    const createDiaryInstance = container.resolve<ICreateDiary>('ICreateDiary');
    setCreateDiary(createDiaryInstance);
  }, []);

  const createNewDiary = () => {
    if (createDiary === undefined || newDiaryName === '') {
      return;
    }
    const summary = createDiary.create(newDiaryName);
    refreshCurrentDiary();
    toast.success(summary.name + 'を新規作成しました');
    setNewDiaryName('');
  };
  return {
    newDiaryName,
    setNewDiaryName,
    createNewDiary,
  };
};

export default useCreateDiary;
