'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { container } from 'tsyringe';

import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import {
  IChangeCurrentDiaryEntry,
  ICurrentDiaryEntryAccessor,
} from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';
import ContextWrapperProps from '@shared/components/contextWrapperProps';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';
import { KeyboardEventHandler } from '@features/diary/components/ui/state/ModalContext';

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
  const { refreshAll } = useRefreshContext();
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
        changeCurrentEntry.moveToNext();
        refreshAll();
      }
      if (e.key === 'ArrowLeft') {
        changeCurrentEntry.moveToPrevious();
        refreshAll();
      }
    },
    [changeCurrentEntry, entryAccessor, refreshAll]
  );
  const moveByDate = useCallback(
    (date: number) => {
      if (changeCurrentEntry === undefined) {
        return;
      }
      changeCurrentEntry.moveByDate(date);
      refreshAll();
    },
    [changeCurrentEntry, refreshAll]
  );
  const moveToLatest = useCallback(() => {
    if (changeCurrentEntry === undefined || diaryAccessor === undefined) {
      return;
    }
    const lastDay = diaryAccessor.getCurrentDiary().getLastDay();
    changeCurrentEntry.moveByDate(lastDay);
    refreshAll();
  }, [changeCurrentEntry, diaryAccessor, refreshAll]);
  const changeCurrentObj = useMemo(() => {
    return { moveByDate, moveToLatest, onArrowMoveEntry };
  }, [moveByDate, moveToLatest, onArrowMoveEntry]);
  if (
    moveByDate === undefined ||
    moveToLatest === undefined ||
    onArrowMoveEntry === undefined
  ) {
    return <div>ChangeCurrentEntryProvider Loading...</div>;
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
