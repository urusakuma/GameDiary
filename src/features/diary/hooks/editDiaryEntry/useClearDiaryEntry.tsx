'use client';
import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

import { IEditDiaryEntry } from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';

const useClearDiaryEntry = () => {
  const [editDiaryEntry, setEditDiaryEntry] = useState<IEditDiaryEntry>();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setEditDiaryEntry(container.resolve<IEditDiaryEntry>('IEditDiaryEntry'));
    setIsReady(true);
  }, []);
  const clear = useCallback(() => {
    if (!isReady || editDiaryEntry === undefined) {
      return;
    }
    editDiaryEntry.clear();
  }, [isReady]);
  return { isReady, clear };
};

export default useClearDiaryEntry;
