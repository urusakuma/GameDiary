'use client';
import { ICreateDiary } from '@/control/controlDiary/controlDiaryInterface';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDiaryEntryResetContext } from 'src/components/context/diaryEntryContext';
import { container } from 'tsyringe';

const useCreateNewDiary = () => {
  const [createDiary, setCreateDiary] = useState<ICreateDiary>();
  const [newDiaryName, setNewDiaryName] = useState('');
  const { refreshEntry } = useDiaryEntryResetContext();

  useEffect(() => {
    const createDiaryInstance = container.resolve<ICreateDiary>('ICreateDiary');
    setCreateDiary(createDiaryInstance);
  }, []);
  const createNewDiary = () => {
    if (createDiary === undefined || newDiaryName === '') {
      return;
    }
    const summary = createDiary.create(newDiaryName);
    refreshEntry();
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
