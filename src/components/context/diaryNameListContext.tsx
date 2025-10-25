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
import { useRefreshContext } from './useRefreshContest';

type DiaryNameListContextType = {
  diaryNames: Array<[string, string]>;
  getDiaryName: (key: string) => string;
};
const DiaryNameListContext = createContext<DiaryNameListContextType | null>(
  null
);
export const DiaryNameListProvider = ({ children }: ContextWrapperProps) => {
  const [diaryNames, setDiaryNames] = useState<Array<[string, string]>>([]);
  const [nameService, setNameService] = useState<IDiaryNameService>();
  const { diaryRefresherRegister } = useRefreshContext();
  useEffect(() => {
    const nameServiceInstance =
      container.resolve<IDiaryNameService>('IDiaryNameService');
    setNameService(nameServiceInstance);

    const refresh = () => {
      if (nameServiceInstance === undefined) {
        return;
      }
      const names = nameServiceInstance.collectDiaryNameEntries();
      setDiaryNames(names);
    };
    refresh();
    const unregister = diaryRefresherRegister(refresh);
    return unregister;
  }, [diaryRefresherRegister]);
  useEffect(() => {
    if (nameService === undefined) {
      return;
    }
    const names = nameService.collectDiaryNameEntries();
    setDiaryNames(names);
  }, [nameService, setDiaryNames]);

  const getDiaryName = useCallback(
    (key: string) => {
      if (nameService === undefined) {
        return '';
      }
      return nameService.getDiaryName(key);
    },
    [nameService]
  );

  const optionsObj: DiaryNameListContextType = useMemo(() => {
    return {
      diaryNames,
      getDiaryName,
    };
  }, [diaryNames, getDiaryName]);
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
