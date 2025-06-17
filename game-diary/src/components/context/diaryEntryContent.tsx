import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { container } from 'tsyringe';
import {
  ICurrentDiaryEntryAccessor,
  IEditDiaryEntry,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';

type DiaryEntryContentContextType = {
  content: string;
  updateContent: (content: string) => void;
  refreshContent: () => void;
};
const DiaryEntryContentContext =
  createContext<DiaryEntryContentContextType | null>(null);
export const DiaryEntryContentProvider = ({
  children,
}: ContextWrapperProps) => {
  const [content, setContent] = useState<string>('');
  const [currentDiaryEntry, setCurrentDiaryEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  const [editDiaryEntry, setEditDiaryEntry] = useState<IEditDiaryEntry>();

  // コンテナから依存性を取得
  useEffect(() => {
    setCurrentDiaryEntryAccessor(
      container.resolve<ICurrentDiaryEntryAccessor>(
        'ICurrentDiaryEntryAccessor'
      )
    );
    setEditDiaryEntry(container.resolve<IEditDiaryEntry>('IEditDiaryEntry'));
  }, []);

  const refreshContent = () => {
    if (currentDiaryEntry === undefined) {
      return;
    }
    const newContent = currentDiaryEntry.getCurrentDiaryEntry().getContent();
    setContent(newContent);
  };
  const updateContent = (content: string) => {
    if (editDiaryEntry === undefined) {
      return;
    }
    editDiaryEntry.editContent(content);
    refreshContent();
  };
  const contentObj: DiaryEntryContentContextType = {
    content,
    updateContent,
    refreshContent,
  };
  return (
    <DiaryEntryContentContext.Provider value={contentObj}>
      {children}
    </DiaryEntryContentContext.Provider>
  );
};
export const useDiaryEntryContentContext = () => {
  const context = useContext(DiaryEntryContentContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntriesListContext must be used within a DiaryEntryContentProvider'
    );
  }
  return context;
};
