import { ICurrentDiaryManager } from '@/model/repository/diaryRepositoryInterfaces';
import { createContext, useEffect, useState, useContext } from 'react';
import { container } from 'tsyringe';
import ContextWrapperProps from './contextWrapperProps';

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
    useState<ICurrentDiaryManager | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  useEffect(() => {
    const currentDiaryManager = container.resolve<ICurrentDiaryManager>(
      'ICurrentDiaryManager'
    );
    setCurrentDiaryManager(currentDiaryManager);
  }, []);
  const selectCurrentDiary = () => {
    if (currentDiaryManager === null) {
      return;
    }
    setSelectedOption(currentDiaryManager.getCurrentDiaryKey());
  };
  const selectedDiaryContextObj = {
    selectedOption,
    setSelectedOption,
    selectCurrentDiary,
  };
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
