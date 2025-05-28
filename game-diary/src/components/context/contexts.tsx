import { ChangeCurrentEntryProvider } from './changeCurrentEntryContext';
import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DarkMeadContextProvider>
      <DiaryNameListProvider>
        <ChangeCurrentEntryProvider>
          <DiaryEntriesListProvider>{children}</DiaryEntriesListProvider>
        </ChangeCurrentEntryProvider>
      </DiaryNameListProvider>
    </DarkMeadContextProvider>
  );
};
export default ContextProvider;
