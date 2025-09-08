import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { container } from 'tsyringe';
import {
  IChangeCurrentDiaryEntry,
  ICurrentDiaryEntryAccessor,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useDiaryEntryResetContext } from './diaryEntryContext';
import { useDiaryEntriesListContext } from './diaryEntryListContext';
import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
type ChangeCurrentEntryContextType = {
  moveByDate: (date: number) => void;
  moveToLatest: () => void;
};
const ChangeCurrentEntryContext =
  createContext<ChangeCurrentEntryContextType | null>(null);
export const ChangeCurrentEntryProvider = ({
  children,
}: ContextWrapperProps) => {
  const [changeCurrentEntry, setChangeCurrentDiaryEntry] =
    useState<IChangeCurrentDiaryEntry>();
  const [entryAccessor, setEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  const [diaryAccessor, setDiaryAccessor] = useState<ICurrentDiaryAccessor>();
  const { refreshEntry } = useDiaryEntryResetContext();
  const { addDiaryEntry, deleteDiaryEntry } = useDiaryEntriesListContext();
  // コンポーネントがマウントされたときにIChangeCurrentDiaryEntryのインスタンスを取得
  useEffect(() => {
    const changeCurrentEntryInstance =
      container.resolve<IChangeCurrentDiaryEntry>('IChangeCurrentDiaryEntry');
    setChangeCurrentDiaryEntry(changeCurrentEntryInstance);
    const entryAccessorInstance = container.resolve<ICurrentDiaryEntryAccessor>(
      'ICurrentDiaryEntryAccessor'
    );
    setEntryAccessor(entryAccessorInstance);
    const diaryAccessorInstance = container.resolve<ICurrentDiaryAccessor>(
      'ICurrentDiaryAccessor'
    );
    setDiaryAccessor(diaryAccessorInstance);
  }, []);
  // キーボードイベントを監視して、Ctrl + ArrowRight/ArrowLeftで日記エントリを移動
  useEffect(() => {
    if (changeCurrentEntry === undefined || entryAccessor === undefined) {
      return;
    }
    window.addEventListener('keydown', onArrow);
    return () => window.removeEventListener('keydown', onArrow);
  }, [changeCurrentEntry, entryAccessor]);

  if (
    changeCurrentEntry === undefined ||
    entryAccessor === undefined ||
    diaryAccessor === undefined
  ) {
    return null;
  }
  const onArrow = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' && e.ctrlKey) {
      const isCreated = changeCurrentEntry.moveToNext();
      refreshEntry();
      if (!isCreated) {
        return;
      }
      const day = entryAccessor.getCurrentDiaryEntry().day;
      const title = entryAccessor.getCurrentDiaryEntry().getTitle();
      addDiaryEntry(day, title);
    }
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
      const day = entryAccessor.getCurrentDiaryEntry().day;
      const isDeleted = changeCurrentEntry.moveToPrevious();
      refreshEntry();
      if (!isDeleted) {
        return;
      }
      deleteDiaryEntry(day);
    }
  };
  const moveByDate = (date: number) => {
    changeCurrentEntry.moveByDate(date);
    refreshEntry();
  };
  const moveToLatest = () => {
    const lastDay = diaryAccessor.getCurrentDiary().getLastDay();
    changeCurrentEntry.moveByDate(lastDay);
    refreshEntry();
  };
  const changeCurrentObj = { moveByDate, moveToLatest };
  return (
    <ChangeCurrentEntryContext.Provider value={changeCurrentObj}>
      {children}
    </ChangeCurrentEntryContext.Provider>
  );
};

export const useChangeCurrentEntryContext = () => {
  const context = useContext(ChangeCurrentEntryContext);
  if (context === null) {
    throw new Error(
      'useChangeCurrentEntryContext must be used within a ChangeCurrentEntryContext'
    );
  }
  return context;
};
