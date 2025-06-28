import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { container } from 'tsyringe';
import { IChangeCurrentDiaryEntry } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useDiaryEntryResetContext } from './dairyEntry/diaryEntryContext';
type ChangeCurrentEntryContextType = {
  moveByDate: (date: number) => void;
};
const ChangeCurrentEntryContext =
  createContext<ChangeCurrentEntryContextType | null>(null);
export const ChangeCurrentEntryProvider = ({
  children,
}: ContextWrapperProps) => {
  const [changeCurrentDiaryEntry, setChangeCurrentDiaryEntry] =
    useState<IChangeCurrentDiaryEntry | null>(null);
  const { refresh } = useDiaryEntryResetContext();
  // コンポーネントがマウントされたときにIChangeCurrentDiaryEntryのインスタンスを取得
  useEffect(() => {
    const instance = container.resolve<IChangeCurrentDiaryEntry>(
      'IChangeCurrentDiaryEntry'
    );
    setChangeCurrentDiaryEntry(instance);
  }, []);
  // キーボードイベントを監視して、Ctrl + ArrowRight/ArrowLeftで日記エントリを移動
  useEffect(() => {
    if (changeCurrentDiaryEntry === null) {
      return;
    }
    const onArrow = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && e.ctrlKey) {
        changeCurrentDiaryEntry.moveToNext();
        refresh();
      }
      if (e.key === 'ArrowLeft' && e.ctrlKey) {
        changeCurrentDiaryEntry.moveToPrevious();
        refresh();
      }
    };
    window.addEventListener('keydown', onArrow);
    return () => window.removeEventListener('keydown', onArrow);
  }, [changeCurrentDiaryEntry]);

  if (changeCurrentDiaryEntry === null) {
    return null;
  }
  const moveByDate = (date: number) => {
    if (changeCurrentDiaryEntry === null) {
      return;
    }
    changeCurrentDiaryEntry.moveByDate(date);
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
