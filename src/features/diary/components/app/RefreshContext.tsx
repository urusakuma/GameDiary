import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

import ContextWrapperProps from '@shared/components/contextWrapperProps';

enum RefreshRange {
  entry,
  diary,
  diaryList,
  all,
}
type RefreshersType = Set<() => void>;
type RefreshContextType = {
  entryRefresherRegister: (fn: () => void) => () => void;
  settingRefresherRegister: (fn: () => void) => () => void;
  diaryRefresherRegister: (fn: () => void) => () => void;
  refreshEntry: () => void;
  refreshSetting: () => void;
  refreshDiary: () => void;
  refreshAll: () => void;
};
const RefreshContext = createContext<RefreshContextType | null>(null);

export const RefreshProvider = ({ children }: ContextWrapperProps) => {
  const entryRefreshers = useRef<RefreshersType>(new Set());
  const settingRefreshers = useRef<RefreshersType>(new Set());
  const diaryRefreshers = useRef<RefreshersType>(new Set());

  const entryRefresherRegister = useCallback((fn: () => void) => {
    return refresherRegister(entryRefreshers, fn);
  }, []);
  const settingRefresherRegister = useCallback((fn: () => void) => {
    return refresherRegister(settingRefreshers, fn);
  }, []);
  const diaryRefresherRegister = useCallback((fn: () => void) => {
    return refresherRegister(diaryRefreshers, fn);
  }, []);
  const refresherRegister = useCallback(
    (arr: MutableRefObject<RefreshersType>, fn: () => void) => {
      arr.current.add(fn);
      return () => {
        arr.current.delete(fn);
      };
    },
    []
  );
  const refreshEntry = useCallback(() => {
    entryRefreshers.current.forEach((fn) => fn());
  }, []);
  const refreshSetting = useCallback(() => {
    settingRefreshers.current.forEach((fn) => fn());
  }, []);
  const refreshDiary = useCallback(() => {
    diaryRefreshers.current.forEach((fn) => fn());
  }, []);
  const refreshAll = useCallback(() => {
    refreshEntry();
    refreshSetting();
    refreshDiary();
  }, [refreshEntry, refreshSetting]);
  const refreshObj = useMemo(() => {
    return {
      entryRefresherRegister,
      settingRefresherRegister,
      diaryRefresherRegister,
      refreshEntry,
      refreshSetting,
      refreshDiary,
      refreshAll,
    };
  }, [entryRefresherRegister, settingRefresherRegister, refreshAll]);
  return (
    <RefreshContext.Provider value={refreshObj}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);
  if (context === null) {
    throw new Error('useRefreshContext must be used within a RefreshProvider');
  }
  return context;
};
