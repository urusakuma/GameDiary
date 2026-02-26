'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { container } from 'tsyringe';

import ContextWrapperProps from '@shared/components/contextWrapperProps';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';
import { useDiaryEntriesListContext } from '@features/diary/components/diary/DiaryEntryListContext';
import useDiaryEntryTitle from '@features/diary/hooks/editDiaryEntry/useDiaryEntryTitle';
import useDiaryEntryContent from '@features/diary/hooks/editDiaryEntry/useDiaryEntryContent';
import useClearDiaryEntry from '@features/diary/hooks/editDiaryEntry/useClearDiaryEntry';
import { ICurrentDiaryEntryAccessor } from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';

type DiaryEntryTitleContextType = {
  title: string;
  updateTitle: (title: string) => void;
};
const DiaryEntryTitleContext = createContext<DiaryEntryTitleContextType | null>(
  null
);
type DiaryEntryContextContextType = {
  content: string;
  updateContent: (content: string) => void;
};
const DiaryEntryStateContext =
  createContext<DiaryEntryContextContextType | null>(null);
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
  const { entryRefresherRegister, refreshAll } = useRefreshContext();
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

  const titleObj: DiaryEntryTitleContextType = useMemo(() => {
    return {
      title,
      updateTitle: (title) => {
        if (currentDiaryEntry === undefined) {
          return;
        }
        updateTitle(title);
        refreshAll();
      },
    };
  }, [title, updateTitle, currentDiaryEntry, refreshAll]);
  const contentObj: DiaryEntryContextContextType = useMemo(() => {
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
        refreshAll();
      },
    };
  }, [clear, refreshAll, currentDiaryEntry]);
  return (
    <DiaryEntryTitleContext.Provider value={titleObj}>
      <DiaryEntryStateContext.Provider value={contentObj}>
        <DiaryEntryClearContext.Provider value={clearObj}>
          {children}
        </DiaryEntryClearContext.Provider>
      </DiaryEntryStateContext.Provider>
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
  const context = useContext(DiaryEntryStateContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntryStateContext must be used within a DiaryEntryStateContext'
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
