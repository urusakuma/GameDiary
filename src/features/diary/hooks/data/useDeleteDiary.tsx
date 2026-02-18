'use client';
import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

import { IDeleteDiary } from '@features/diary/control/diary/controlDiaryInterface';
import { useSelectedDiaryContext } from '@features/diary/components/diary/SelectedDiaryContext';
import useFetchHowToUse from '@features/diary/hooks/io/useFetchHowToUse';

import useRefreshCurrentDiary from './useRefreshCurrentDiary';

const useDeleteDiary = () => {
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
export default useDeleteDiary;
