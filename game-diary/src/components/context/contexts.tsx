import { ChangeCurrentEntryProvider } from './changeCurrentEntryContext';
import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
import { DiaryEntryProvider } from './dairyEntry/diaryEntryContext';
import ContextWrapperProps from './contextWrapperProps';
const ContextProvider = ({ children }: ContextWrapperProps) => {
  return (
    <DarkMeadContextProvider>
      <DiaryNameListProvider>
        <DiaryEntryProvider>
          <ChangeCurrentEntryProvider>
            <DiaryEntriesListProvider>{children}</DiaryEntriesListProvider>
          </ChangeCurrentEntryProvider>
        </DiaryEntryProvider>
      </DiaryNameListProvider>
    </DarkMeadContextProvider>
  );
};
export default ContextProvider;
