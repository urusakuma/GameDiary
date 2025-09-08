import { useChangeCurrentEntryContext } from 'src/components/context/changeCurrentEntryContext';
import { useDiaryEntryResetContext } from 'src/components/context/diaryEntryContext';
import { useDiaryEntriesListContext } from 'src/components/context/diaryEntryListContext';

const useRefreshCurrentDiary = () => {
  const { refreshDiaryEntries } = useDiaryEntriesListContext();
  const { refreshEntry } = useDiaryEntryResetContext();
  const { moveToLatest } = useChangeCurrentEntryContext();
  const refreshCurrentDiary = () => {
    refreshEntry();
    refreshDiaryEntries();
    moveToLatest();
  };
  return { refreshCurrentDiary };
};

export default useRefreshCurrentDiary;
