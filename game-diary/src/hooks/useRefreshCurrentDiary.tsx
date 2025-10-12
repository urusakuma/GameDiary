import { useChangeCurrentEntryContext } from 'src/components/context/changeCurrentEntryContext';
import { useRefreshContext } from 'src/components/context/useRefreshContest';

const useRefreshCurrentDiary = () => {
  const { refreshAll } = useRefreshContext();
  const { moveToLatest } = useChangeCurrentEntryContext();
  const refreshCurrentDiary = () => {
    refreshAll();
    moveToLatest();
  };
  return { refreshCurrentDiary };
};

export default useRefreshCurrentDiary;
