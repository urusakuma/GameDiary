'use client';
import { IDeleteDiary } from '@/control/controlDiary/controlDiaryInterface';
import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';
import useFetchHowToUse from './useFetchHowToUse';
import useRefreshCurrentDiary from './useRefreshCurrentDiary';
import { useSelectedDiaryContext } from 'src/components/context/selectedDiaryContext';

const useDiaryDelete = () => {
  const [diaryDelete, setDiaryDelete] = useState<IDeleteDiary>();
  const { useReadHowToUse } = useFetchHowToUse();
  const { refreshCurrentDiary } = useRefreshCurrentDiary();
  const { selectCurrentDiary } = useSelectedDiaryContext();
  useEffect(() => {
    const diaryDeleteInstance = container.resolve<IDeleteDiary>('IDeleteDiary');
    setDiaryDelete(diaryDeleteInstance);
  }, []);
  const deleteDiary = useCallback(
    async (key: string) => {
      if (diaryDelete === undefined) {
        return;
      }
      const isDeleted = diaryDelete.delete(key);
      if (!isDeleted) {
        await useReadHowToUse();
        diaryDelete.delete(key);
      }
      refreshCurrentDiary();
      selectCurrentDiary();
    },
    [diaryDelete, useReadHowToUse, refreshCurrentDiary, selectCurrentDiary]
  );
  return { deleteDiary };
};
export default useDiaryDelete;
