'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { container } from 'tsyringe';
import {
  IChangeCurrentDiaryEntry,
  ICurrentDiaryEntryAccessor,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useDiaryEntriesListContext } from './diaryEntryListContext';
import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import { KeyboardEventHandler } from './modalContext';
import { useRefreshContext } from './useRefreshContest';
type ChangeCurrentEntryContextType = {
  moveByDate: (date: number) => void;
  moveToLatest: () => void;
  onArrowMoveEntry: KeyboardEventHandler;
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
  const { refreshEntry } = useRefreshContext();
  const { addDiaryEntry, deleteDiaryEntry } = useDiaryEntriesListContext();
  useEffect(() => {
    // 初期化処理
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

  const onArrowMoveEntry: KeyboardEventHandler = useCallback(
    (e, isModal) => {
      if (changeCurrentEntry === undefined || entryAccessor === undefined) {
        return;
      }
      if (e.ctrlKey === false || !isModal.home()) {
        return;
      }
      if (e.key === 'ArrowRight') {
        const isCreated = changeCurrentEntry.moveToNext();
        refreshEntry();
        if (!isCreated) {
          return;
        }
        const day = entryAccessor.getCurrentDiaryEntry().day;
        const title = entryAccessor.getCurrentDiaryEntry().getTitle();
        addDiaryEntry(day, title);
      }
      if (e.key === 'ArrowLeft') {
        const day = entryAccessor.getCurrentDiaryEntry().day;
        const isDeleted = changeCurrentEntry.moveToPrevious();
        refreshEntry();
        if (!isDeleted) {
          return;
        }
        deleteDiaryEntry(day);
      }
    },
    [
      changeCurrentEntry,
      entryAccessor,
      refreshEntry,
      addDiaryEntry,
      deleteDiaryEntry,
    ]
  );
  const moveByDate = useCallback(
    (date: number) => {
      if (changeCurrentEntry === undefined) {
        return;
      }
      changeCurrentEntry.moveByDate(date);
      refreshEntry();
    },
    [changeCurrentEntry, refreshEntry]
  );
  const moveToLatest = useCallback(() => {
    if (changeCurrentEntry === undefined || diaryAccessor === undefined) {
      return;
    }
    const lastDay = diaryAccessor.getCurrentDiary().getLastDay();
    changeCurrentEntry.moveByDate(lastDay);
    refreshEntry();
  }, [changeCurrentEntry, diaryAccessor, refreshEntry]);
  const changeCurrentObj = useMemo(() => {
    return { moveByDate, moveToLatest, onArrowMoveEntry };
  }, [moveByDate, moveToLatest, onArrowMoveEntry]);
  if (
    moveByDate === undefined ||
    moveToLatest === undefined ||
    onArrowMoveEntry === undefined
  ) {
    return <div>Loading...</div>;
  }
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
