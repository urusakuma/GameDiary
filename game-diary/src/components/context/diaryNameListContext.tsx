'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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

  const updateDiaryName = useCallback(
    (key: string, name: string) => {
      if (nameService === undefined) {
        return;
      }
      setOptions((prev) => prev.map((v) => (v[0] === key ? [v[0], name] : v)));
      nameService.updateDiaryName(key, name);
    },
    [nameService]
  );
  const getDiaryName = useCallback(
    (key: string) => {
      if (nameService === undefined) {
        return '';
      }
      return nameService.getDiaryName(key);
    },
    [nameService]
  );
  const refreshDiaryNames = useCallback(() => {
    if (nameService === undefined) {
      return;
    }
    const names = nameService.collectDiaryNameEntries();
    setOptions(names);
  }, [nameService]);

  const optionsObj: DiaryNameListContextType = useMemo(() => {
    return {
      diaryNames,
      refreshDiaryNames,
      getDiaryName,
      updateDiaryName,
    };
  }, [diaryNames, refreshDiaryNames, getDiaryName, updateDiaryName]);
  if (optionsObj === undefined) {
    return <div>Loading...</div>;
  }
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
