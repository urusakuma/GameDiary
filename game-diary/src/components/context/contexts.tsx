import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DarkMeadContextProvider>
      <DiaryNameListProvider>
        <DiaryEntriesListProvider>{children}</DiaryEntriesListProvider>
      </DiaryNameListProvider>
    </DarkMeadContextProvider>
  );
};
export default ContextProvider;
