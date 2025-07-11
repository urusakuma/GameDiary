import { ChangeCurrentEntryProvider } from './changeCurrentEntryContext';
import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
import { DiaryEntryProvider } from './diaryEntryContext';
import ContextWrapperProps from './contextWrapperProps';
const ContextProvider = ({ children }: ContextWrapperProps) => {
  return (
    <DarkMeadContextProvider>
      <DiaryNameListProvider>
        <DiaryEntriesListProvider>
          <DiaryEntryProvider>
            <ChangeCurrentEntryProvider>{children}</ChangeCurrentEntryProvider>
          </DiaryEntryProvider>
        </DiaryEntriesListProvider>
      </DiaryNameListProvider>
    </DarkMeadContextProvider>
  );
};
export default ContextProvider;
