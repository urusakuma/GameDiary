import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import useDiaryEntryTitle from 'src/hooks/editDiaryEntry/useDiaryEntryTitle';
import useDiaryEntryContent from 'src/hooks/editDiaryEntry/useDiaryEntryContent';
import useClearDiaryEntry from 'src/hooks/editDiaryEntry/useClearDiaryEntry';
import { useDiaryEntriesListContext } from './diaryEntryListContext';
import { ICurrentDiaryEntryAccessor } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

type DiaryEntryTitleContextType = {
  title: string;
  updateTitle: (title: string) => void;
  refreshTitle: () => void;
};
const DiaryEntryTitleContext = createContext<DiaryEntryTitleContextType | null>(
  null
);
type DiaryEntryContentContextType = {
  content: string;
  updateContent: (content: string) => void;
  refreshContent: () => void;
};
const DiaryEntryContentContext =
  createContext<DiaryEntryContentContextType | null>(null);
type DiaryEntryResetContextType = {
  refresh: () => void;
  clear: () => void;
};
const DiaryEntryResetContext = createContext<DiaryEntryResetContextType | null>(
  null
);
export const DiaryEntryProvider = ({ children }: ContextWrapperProps) => {
  const {
    isReady: isReadyTitle,
    title,
    updateTitle,
    refreshTitle,
  } = useDiaryEntryTitle();
  const {
    isReady: isReadyContent,
    content,
    updateContent,
    refreshContent,
  } = useDiaryEntryContent();
  const { isReady: isReadyClear, clear } = useClearDiaryEntry();

  const [currentDiaryEntry, setCurrentDiaryEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  useEffect(() => {
    setCurrentDiaryEntryAccessor(
      container.resolve<ICurrentDiaryEntryAccessor>(
        'ICurrentDiaryEntryAccessor'
      )
    );
  }, []);
  const { updateDiaryEntryTitle } = useDiaryEntriesListContext();
  if (
    !isReadyTitle ||
    !isReadyContent ||
    !isReadyClear ||
    currentDiaryEntry === undefined
  ) {
    return null;
  }
  const titleObj: DiaryEntryTitleContextType = {
    title: title,
    updateTitle: (title) => {
      updateTitle(title);
      const day = currentDiaryEntry.getCurrentDiaryEntry().day;
      updateDiaryEntryTitle(day, title);
    },
    refreshTitle: refreshTitle,
  };
  const contentObj: DiaryEntryContentContextType = {
    content: content,
    updateContent: updateContent,
    refreshContent: refreshContent,
  };
  const resetObj: DiaryEntryResetContextType = {
    refresh: () => {
      refreshTitle();
      refreshContent();
    },
    clear: () => {
      clear();
      refreshTitle();
      refreshContent();
    },
  };
  return (
    <DiaryEntryTitleContext.Provider value={titleObj}>
      <DiaryEntryContentContext.Provider value={contentObj}>
        <DiaryEntryResetContext.Provider value={resetObj}>
          {children}
        </DiaryEntryResetContext.Provider>
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
  const context = useContext(DiaryEntryResetContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntryResetContext must be used within a DiaryEntryResetContext'
    );
  }
  return context;
};
