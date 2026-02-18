import { container } from 'tsyringe';
import { createContext, useContext, useEffect, useState } from 'react';

import ContextWrapperProps from '@shared/components/contextWrapperProps';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { ICurrentDiaryEntryAccessor } from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';

type DayTitlePairType = { day: number; title: string };
type DiaryEntryListContextType = {
  diaryEntries: DayTitlePairType[];
  addDiaryEntry: (day: number, title: string) => void;
  deleteDiaryEntry: (day: number) => void;
  updateDiaryEntryTitle: (day: number, title: string) => void;
};
const DiaryEntriesListContext = createContext<DiaryEntryListContextType | null>(
  null
);
export const DiaryEntriesListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryAccessor, setDiaryAccessor] = useState<ICurrentDiaryAccessor>();
  const [entryAccessor, setEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  const [diaryEntries, setDiaryEntries] = useState<DayTitlePairType[]>([]);
  const { diaryRefresherRegister } = useRefreshContext();
  useEffect(() => {
    const diaryAccessorInstance = container.resolve<ICurrentDiaryAccessor>(
      'ICurrentDiaryAccessor'
    );
    setDiaryAccessor(diaryAccessorInstance);
    const entryAccessorInstance = container.resolve<ICurrentDiaryEntryAccessor>(
      'ICurrentDiaryEntryAccessor'
    );
    setEntryAccessor(entryAccessorInstance);
    const refresh = () => {
      const list = [];
      let day: number | undefined = diaryAccessorInstance
        .getCurrentDiary()
        .getLastDay();
      while (day !== undefined) {
        const entry = diaryAccessorInstance.getCurrentDiary().getEntry(day);
        list.unshift({ day, title: entry.getTitle() });
        day = entry.previous;
      }
      setDiaryEntries(list);
    };
    refresh();
    const unregister = diaryRefresherRegister(refresh);
    return unregister;
  }, [diaryRefresherRegister]);
  if (diaryAccessor === undefined || entryAccessor === undefined) {
    return <div>Loading...</div>;
  }
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
