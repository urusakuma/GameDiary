import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { container } from 'tsyringe';
import {
  IChangeCurrentDiaryEntry,
  ICurrentDiaryEntryAccessor,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useDiaryEntryResetContext } from './diaryEntryContext';
import { useDiaryEntriesListContext } from './diaryEntryListContext';
type ChangeCurrentEntryContextType = {
  moveByDate: (date: number) => void;
};
const ChangeCurrentEntryContext =
  createContext<ChangeCurrentEntryContextType | null>(null);
export const ChangeCurrentEntryProvider = ({
  children,
}: ContextWrapperProps) => {
  const [changeCurrentEntry, setChangeCurrentDiaryEntry] =
    useState<IChangeCurrentDiaryEntry | null>(null);
  const [entryAccessor, setEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor | null>(null);
  const { refresh } = useDiaryEntryResetContext();
  const { addDiaryEntry, detachDiaryEntry } = useDiaryEntriesListContext();
  // コンポーネントがマウントされたときにIChangeCurrentDiaryEntryのインスタンスを取得
  useEffect(() => {
    const changeCurrentEntryInstance =
      container.resolve<IChangeCurrentDiaryEntry>('IChangeCurrentDiaryEntry');
    setChangeCurrentDiaryEntry(changeCurrentEntryInstance);
    const entryAccessorInstance = container.resolve<ICurrentDiaryEntryAccessor>(
      'ICurrentDiaryEntryAccessor'
    );
    setEntryAccessor(entryAccessorInstance);
  }, []);
  // キーボードイベントを監視して、Ctrl + ArrowRight/ArrowLeftで日記エントリを移動
  useEffect(() => {
    if (changeCurrentEntry === null || entryAccessor === null) {
      return;
    }
    const onArrow = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && e.ctrlKey) {
        const isCreated = changeCurrentEntry.moveToNext();
        refresh();
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
        refresh();
        if (!isDeleted) {
          return;
        }
        detachDiaryEntry(day);
      }
    };
    window.addEventListener('keydown', onArrow);
    return () => window.removeEventListener('keydown', onArrow);
  }, [changeCurrentEntry]);

  if (changeCurrentEntry === null) {
    return null;
  }
  const moveByDate = (date: number) => {
    if (changeCurrentEntry === null) {
      return;
    }
    changeCurrentEntry.moveByDate(date);
    refresh();
  };
  return (
    <ChangeCurrentEntryContext.Provider value={{ moveByDate }}>
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
