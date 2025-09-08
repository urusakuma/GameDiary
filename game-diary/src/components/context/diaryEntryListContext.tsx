import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import { container } from 'tsyringe';
import { ICurrentDiaryEntryAccessor } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';

type DayTitlePairType = { day: number; title: string };
type DiaryEntryListContextType = {
  diaryEntries: DayTitlePairType[];
  refreshDiaryEntries: () => void;
  addDiaryEntry: (day: number, title: string) => void;
  deleteDiaryEntry: (day: number) => void;
  updateDiaryEntryTitle: (day: number, title: string) => void;
};
const DiaryEntriesListContext = createContext<DiaryEntryListContextType | null>(
  null
);
export const DiaryEntriesListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryAccessor, setDiaryAccessor] =
    useState<ICurrentDiaryAccessor | null>(null);
  const [entryAccessor, setEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DayTitlePairType[]>([]);
  const [isReady, setIsReady] = useState(false);
  // 初期化処理
  useEffect(() => {
    const diaryAccessorInstance = container.resolve<ICurrentDiaryAccessor>(
      'ICurrentDiaryAccessor'
    );
    setDiaryAccessor(diaryAccessorInstance);
    const entryAccessorInstance = container.resolve<ICurrentDiaryEntryAccessor>(
      'ICurrentDiaryEntryAccessor'
    );
    setEntryAccessor(entryAccessorInstance);
    setIsReady(true);
  }, []);
  useEffect(() => {
    if (!isReady) {
      return;
    }
    refreshDiaryEntries();
  }, [isReady]);
  if (diaryAccessor === null || entryAccessor === null) {
    return null;
  }
  const refreshDiaryEntries = () => {
    const list = [];
    let day: number | undefined = diaryAccessor.getCurrentDiary().getLastDay();
    console.log(
      'current diary name is ',
      diaryAccessor.getCurrentDiary().getSettings().getDiaryName()
    );
    while (day !== undefined) {
      const entry = diaryAccessor.getCurrentDiary().getEntry(day);
      list.unshift({ day, title: entry.getTitle() });
      day = entry.previous;
    }
    setDiaryEntries(list);
  };
  const addDiaryEntry = (day: number, title: string) => {
    const pair = { day, title };
    setDiaryEntries((prev) => [...prev, pair]);
  };
  const deleteDiaryEntry = (day: number) => {
    const isToday = day === entryAccessor.getCurrentDiaryEntry().day;
    if (isToday) {
      return;
    }
    setDiaryEntries((prev) =>
      prev.filter((option, i) => i === 0 || option.day !== day)
    );
    diaryAccessor.getCurrentDiary().deleteEntry(day);
  };
  const updateDiaryEntryTitle = (day: number, title: string) => {
    setDiaryEntries((prev) =>
      prev.map((pair) => (pair.day === day ? { ...pair, title } : pair))
    );
  };
  const optionsObj: DiaryEntryListContextType = {
    diaryEntries: diaryEntries,
    refreshDiaryEntries,
    addDiaryEntry,
    deleteDiaryEntry,
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
