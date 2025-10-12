'use client';
import { ICreateDiary } from '@/control/controlDiary/controlDiaryInterface';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { container } from 'tsyringe';
import useRefreshCurrentDiary from './useRefreshCurrentDiary';

const useCreateNewDiary = () => {
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
export default useCreateNewDiary;
