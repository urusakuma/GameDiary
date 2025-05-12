import { createContext, useContext, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';

type KeyNamePairType = { key: string; name: string };
type DiaryNameListContextType = {
  diaryNames: KeyNamePairType[];
  addDiaryName: (key: string, name: string) => void;
  removeDiaryName: (key: string) => void;
  updateDiaryName: (key: string, name: string) => void;
};
const DiaryNameListContext = createContext<DiaryNameListContextType | null>(
  null
);
export const DiaryNameListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryNames, setOptions] = useState<KeyNamePairType[]>([]);
  const addDiaryName = (key: string, name: string) => {
    const pair = { key, name };
    setOptions([...diaryNames, pair]);
  };
  const removeDiaryName = (key: string) => {
    setOptions(diaryNames.filter((option) => option.key !== key));
  };
  const updateDiaryName = (key: string, name: string) => {
    setOptions(
      diaryNames.map((pair) =>
        pair.key === key ? { ...pair, name: name } : pair
      )
    );
  };
  const optionsObj: DiaryNameListContextType = {
    diaryNames: diaryNames,
    addDiaryName: addDiaryName,
    removeDiaryName: removeDiaryName,
    updateDiaryName: updateDiaryName,
  };
  return (
    <DiaryNameListContext.Provider value={optionsObj}>
      {children}
    </DiaryNameListContext.Provider>
  );
};
export const useDiaryNameListContext = () => {
  const context = useContext(DiaryNameListContext);
  if (context === null) {
    throw new Error(
      'useDiaryNameListContext must be used within a DiaryNameListProvider'
    );
  }
  return context;
};
