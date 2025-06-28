import { IEditDiaryEntry } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

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
