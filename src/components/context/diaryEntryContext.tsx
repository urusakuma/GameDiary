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
import useDiaryEntryTitle from 'src/hooks/editDiaryEntry/useDiaryEntryTitle';
import useDiaryEntryContent from 'src/hooks/editDiaryEntry/useDiaryEntryContent';
import useClearDiaryEntry from 'src/hooks/editDiaryEntry/useClearDiaryEntry';
import { useDiaryEntriesListContext } from './diaryEntryListContext';
import { ICurrentDiaryEntryAccessor } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';
import { useRefreshContext } from './useRefreshContest';

type DiaryEntryTitleContextType = {
  title: string;
  updateTitle: (title: string) => void;
};
const DiaryEntryTitleContext = createContext<DiaryEntryTitleContextType | null>(
  null
);
type DiaryEntryContentContextType = {
  content: string;
  updateContent: (content: string) => void;
};
const DiaryEntryContentContext =
  createContext<DiaryEntryContentContextType | null>(null);
type DiaryEntryClearContextType = {
  clearEntry: () => void;
};
const DiaryEntryClearContext = createContext<DiaryEntryClearContextType | null>(
  null
);
export const DiaryEntryProvider = ({ children }: ContextWrapperProps) => {
  const { title, updateTitle, refreshTitle } = useDiaryEntryTitle();
  const { content, updateContent, refreshContent } = useDiaryEntryContent();
  const { clear } = useClearDiaryEntry();
  const { entryRefresherRegister, refreshEntry } = useRefreshContext();
  const {} = useDiaryEntriesListContext();

  const [currentDiaryEntry, setCurrentDiaryEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  useEffect(() => {
    const accessor = container.resolve<ICurrentDiaryEntryAccessor>(
      'ICurrentDiaryEntryAccessor'
    );
    setCurrentDiaryEntryAccessor(accessor);
    const refresh = () => {
      refreshTitle();
      refreshContent();
    };
    refresh();
    const unregister = entryRefresherRegister(refresh);
    return unregister;
  }, [entryRefresherRegister, refreshTitle, refreshContent]);
  const { updateDiaryEntryTitle } = useDiaryEntriesListContext();

  const titleObj: DiaryEntryTitleContextType = useMemo(() => {
    return {
      title,
      updateTitle: (title) => {
        if (currentDiaryEntry === undefined) {
          return;
        }
        updateTitle(title);
        const day = currentDiaryEntry.getCurrentDiaryEntry().day;
        updateDiaryEntryTitle(day, title);
      },
    };
  }, [title, updateTitle, currentDiaryEntry, updateDiaryEntryTitle]);
  const contentObj: DiaryEntryContentContextType = useMemo(() => {
    return {
      content,
      updateContent,
    };
  }, [content, updateContent]);
  const clearObj: DiaryEntryClearContextType = useMemo(() => {
    return {
      clearEntry: () => {
        if (currentDiaryEntry === undefined) {
          return;
        }
        clear();
        refreshEntry();
        const day = currentDiaryEntry.getCurrentDiaryEntry().day;
        const title = currentDiaryEntry.getCurrentDiaryEntry().getTitle();
        updateDiaryEntryTitle(day, title);
      },
    };
  }, [clear, refreshEntry, currentDiaryEntry]);
  return (
    <DiaryEntryTitleContext.Provider value={titleObj}>
      <DiaryEntryContentContext.Provider value={contentObj}>
        <DiaryEntryClearContext.Provider value={clearObj}>
          {children}
        </DiaryEntryClearContext.Provider>
      </DiaryEntryContentContext.Provider>
    </DiaryEntryTitleContext.Provider>
  );
};

export const useDiaryEntryTitleContext = () => {
  const context = useContext(DiaryEntryTitleContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntryTitleContext must be used within a DiaryEntryTitleContext'
    );
  }
  return context;
};
export const useDiaryEntryContentContext = () => {
  const context = useContext(DiaryEntryContentContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntryContentContext must be used within a DiaryEntryContentContext'
    );
  }
  return context;
};

export const useDiaryEntryResetContext = () => {
  const context = useContext(DiaryEntryClearContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntryResetContext must be used within a DiaryEntryResetContext'
    );
  }
  return context;
};
