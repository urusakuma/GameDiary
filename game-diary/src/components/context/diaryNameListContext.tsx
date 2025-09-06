import { createContext, useContext, useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import { IDiaryNameService } from '@/control/controlDiary/controlDiaryInterface';
import { container } from 'tsyringe';

type DiaryNameListContextType = {
  diaryNames: Array<[string, string]>;
  refreshDiaryNames: () => void;
  getDiaryName: (key: string) => string;
  updateDiaryName: (key: string, name: string) => void;
};
const DiaryNameListContext = createContext<DiaryNameListContextType | null>(
  null
);
export const DiaryNameListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryNames, setOptions] = useState<Array<[string, string]>>([]);
  const [nameService, setNameService] = useState<IDiaryNameService>();

  useEffect(() => {
    const nameServiceInstance =
      container.resolve<IDiaryNameService>('IDiaryNameService');
    setNameService(nameServiceInstance);
  }, []);
  useEffect(() => {
    if (nameService === undefined) {
      return;
    }
    const names = nameService.collectDiaryNameEntries();
    setOptions(names);
  }, [nameService]);
  const refreshDiaryNames = () => {
    if (nameService === undefined) {
      return;
    }
    const names = nameService.collectDiaryNameEntries();
    setOptions(names);
  };
  const getDiaryName = (key: string) => {
    if (nameService === undefined) {
      return '';
    }
    return nameService.getDiaryName(key);
  };
  const updateDiaryName = (key: string, name: string) => {
    setOptions(diaryNames.map((v) => (v[0] === key ? [v[0], name] : v)));
    if (nameService === undefined) {
      return;
    }
    nameService.updateDiaryName(key, name);
  };
  const optionsObj: DiaryNameListContextType = {
    diaryNames,
    refreshDiaryNames,
    getDiaryName,
    updateDiaryName,
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
