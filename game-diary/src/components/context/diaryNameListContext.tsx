import { createContext, useContext, useState } from 'react';

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
interface DiaryNameListProviderProps {
  children: React.ReactNode;
}
export const DiaryNameListProvider = ({
  children,
}: DiaryNameListProviderProps) => {
  const [DiaryNames, setOptions] = useState<KeyNamePairType[]>([]);
  const addDiaryName = (key: string, name: string) => {
    const pair = { key, name };
    setOptions([...DiaryNames, pair]);
  };
  const removeDiaryName = (key: string) => {
    setOptions(DiaryNames.filter((option) => option.key !== key));
  };
  const updateDiaryName = (key: string, name: string) => {
    setOptions(
      DiaryNames.map((pair) =>
        pair.key === key ? { ...pair, name: name } : pair
      )
    );
  };
  const optionsObj: DiaryNameListContextType = {
    diaryNames: DiaryNames,
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
