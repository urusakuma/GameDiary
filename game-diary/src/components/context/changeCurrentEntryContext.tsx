import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { container } from 'tsyringe';
import { IChangeCurrentDiaryEntry } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useDiaryEntryContentContext } from './diaryEntryContent';
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
  const { refreshContent } = useDiaryEntryContentContext();
  useEffect(() => {
    const instance = container.resolve<IChangeCurrentDiaryEntry>(
      'IChangeCurrentDiaryEntry'
    );
    setChangeCurrentDiaryEntry(instance);
    if (instance === null) {
      return;
    }
    const onArrow = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && e.ctrlKey) {
        instance.moveToNext();
        refreshContent();
      }
      if (e.key === 'ArrowLeft' && e.ctrlKey) {
        instance.moveToPrevious();
        refreshContent();
      }
    };
    window.addEventListener('keydown', onArrow);
    return () => window.removeEventListener('keydown', onArrow);
  }, []);
  const moveByDate = (date: number) => {
    changeCurrentDiaryEntry?.moveByDate(date);
    refreshContent();
  };
  return (
    <ChangeCurrentEntryContext.Provider value={{ moveByDate }}>
      {children}
    </ChangeCurrentEntryContext.Provider>
  );
};
