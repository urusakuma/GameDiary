'use client';
import { IDeleteDiary } from '@/control/controlDiary/controlDiaryInterface';
import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

const useDiaryDelete = () => {
  const [dairyDelete, setDiaryDelete] = useState<IDeleteDiary>();

  useEffect(() => {
    const diaryDeleteInstance = container.resolve<IDeleteDiary>('IDeleteDiary');
    setDiaryDelete(diaryDeleteInstance);
  }, []);
  const deleteDiary = useCallback(
    (key: string) => {
      if (dairyDelete === undefined) {
        return;
      }
      dairyDelete.delete(key);
    },
    [dairyDelete]
  );
  return { deleteDiary };
};
export default useDiaryDelete;
