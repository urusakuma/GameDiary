'use client';
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { container } from 'tsyringe';

import ContextWrapperProps from '@shared/components/contextWrapperProps';
import { ICurrentDiaryManager } from '@features/diary/services/persistence/diaryPersistenceInterfaces';

type SelectedDiaryContextType = {
  selectedOption: string;
  setSelectedOption: (val: string) => void;
  selectCurrentDiary: () => void;
};
const SelectedDiaryContext = createContext<SelectedDiaryContextType | null>(
  null
);
export const SelectedDiaryProvider = ({ children }: ContextWrapperProps) => {
  const [currentDiaryManager, setCurrentDiaryManager] =
    useState<ICurrentDiaryManager>();
  const [selectedOption, setSelectedOption] = useState<string>('');
  useEffect(() => {
    const currentDiaryManager = container.resolve<ICurrentDiaryManager>(
      'ICurrentDiaryManager'
    );
    setCurrentDiaryManager(currentDiaryManager);
  }, []);

  const selectCurrentDiary = useCallback(() => {
    if (currentDiaryManager === undefined) {
      return;
    }
    setSelectedOption(currentDiaryManager.getCurrentDiaryKey());
  }, [currentDiaryManager]);

  const selectedDiaryContextObj = useMemo(() => {
    return { selectedOption, setSelectedOption, selectCurrentDiary };
  }, [selectedOption, setSelectedOption, selectCurrentDiary]);
  if (selectedDiaryContextObj === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <SelectedDiaryContext.Provider value={selectedDiaryContextObj}>
      {children}
    </SelectedDiaryContext.Provider>
  );
};

export const useSelectedDiaryContext = () => {
  const context = useContext(SelectedDiaryContext);
  if (context === null) {
    throw new Error(
      'useSelectedDiaryContext must be used within a DiaryNameListProvider'
    );
  }
  return context;
};
