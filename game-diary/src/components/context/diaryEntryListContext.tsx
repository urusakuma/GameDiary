import { createContext, useContext, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';

type DayTitlePairType = { day: number; title: string };
type DiaryEntryListContextType = {
  diaryEntries: DayTitlePairType[];
  addDiaryEntry: (day: number, title: string) => void;
  removeDiaryEntry: (day: number) => void;
  updateDiaryEntryTitle: (day: number, title: string) => void;
};
const DiaryEntriesListContext = createContext<DiaryEntryListContextType | null>(
  null
);
export const DiaryEntriesListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryEntries, setListItems] = useState<DayTitlePairType[]>([]);
  const addDiaryEntry = (day: number, title: string) => {
    const pair = { day, title };
    let list = [...diaryEntries, pair];
    list = list.sort((a, b) => a.day - b.day);
    setListItems(list);
  };
  const removeDiaryEntry = (day: number) => {
    setListItems(diaryEntries.filter((option) => option.day !== day));
  };
  const updateDiaryEntryTitle = (day: number, title: string) => {
    setListItems(
      diaryEntries.map((pair) => (pair.day === day ? { ...pair, title } : pair))
    );
  };
  const optionsObj: DiaryEntryListContextType = {
    diaryEntries: diaryEntries,
    addDiaryEntry,
    removeDiaryEntry,
    updateDiaryEntryTitle,
  };
  return (
    <DiaryEntriesListContext.Provider value={optionsObj}>
      {children}
    </DiaryEntriesListContext.Provider>
  );
};
export const useDiaryEntriesListContext = () => {
  const context = useContext(DiaryEntriesListContext);
  if (context === null) {
    throw new Error(
      'useDiaryEntriesListContext must be used within a DiaryNameListProvider'
    );
  }
  return context;
};
