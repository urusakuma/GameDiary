import { useChangeCurrentEntryContext } from '@features/diary/components/diaryEntry/ChangeCurrentEntryContext';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';

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
