import { ChangeCurrentEntryProvider } from './changeCurrentEntryContext';
import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntryContentProvider } from './diaryEntryContent';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DarkMeadContextProvider>
      <DiaryNameListProvider>
        <DiaryEntryContentProvider>
          <ChangeCurrentEntryProvider>
            <DiaryEntriesListProvider>{children}</DiaryEntriesListProvider>
          </ChangeCurrentEntryProvider>
        </DiaryEntryContentProvider>
      </DiaryNameListProvider>
    </DarkMeadContextProvider>
  );
};
export default ContextProvider;
