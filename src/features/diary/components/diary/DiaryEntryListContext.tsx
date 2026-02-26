import { container } from 'tsyringe';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import ContextWrapperProps from '@shared/components/contextWrapperProps';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { ICurrentDiaryEntryAccessor } from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';

type DayTitlePairType = { day: number; title: string };
type DiaryEntryListContextType = {
  diaryEntries: DayTitlePairType[];
  deleteEntry: (day: number) => void;
};
const DiaryEntriesListContext = createContext<DiaryEntryListContextType | null>(
  null
);
export const DiaryEntriesListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryAccessor, setDiaryAccessor] = useState<ICurrentDiaryAccessor>();
  const [entryAccessor, setEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  const [diaryEntries, setDiaryEntries] = useState<DayTitlePairType[]>([]);
  const { diaryRefresherRegister, refreshDiary } = useRefreshContext();
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
      const list: Array<DayTitlePairType> = [];
      const iterator = diaryAccessorInstance
        .getCurrentDiary()
        .collectEntryDays();
      iterator.forEach((day) => {
        const entry = diaryAccessorInstance.getCurrentDiary().getEntry(day);
        list.push({ day, title: entry.getTitle() });
      });
      setDiaryEntries(list);
    };
    refresh();
    const unregister = diaryRefresherRegister(refresh);
    return unregister;
  }, [diaryRefresherRegister]);

  const deleteEntry = useCallback(
    (day: number) => {
      if (
        entryAccessor === undefined ||
        diaryAccessor === undefined ||
        refreshDiary === undefined
      ) {
        return;
      }
      const isToday = day === entryAccessor.getCurrentDiaryEntry().day;
      if (isToday) {
        return;
      }
      diaryAccessor.getCurrentDiary().deleteEntry(day);
      refreshDiary();
    },
    [entryAccessor, diaryAccessor, refreshDiary]
  );
  if (diaryAccessor === undefined || entryAccessor === undefined) {
    return <div>Loading...</div>;
  }
  const optionsObj: DiaryEntryListContextType = {
    diaryEntries,
    deleteEntry,
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
