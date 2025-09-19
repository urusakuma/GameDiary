import { ChangeCurrentEntryProvider } from './changeCurrentEntryContext';
import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
import { DiaryEntryProvider } from './diaryEntryContext';
import ContextWrapperProps from './contextWrapperProps';
import { SelectedDiaryProvider } from './selectedDiaryContext';
import AppInitProvider from './appInitProvider';
const ContextProvider = ({ children }: ContextWrapperProps) => {
  return (
    <AppInitProvider>
      <DarkMeadContextProvider>
        <DiaryNameListProvider>
          <SelectedDiaryProvider>
            <DiaryEntriesListProvider>
              <DiaryEntryProvider>
                <ChangeCurrentEntryProvider>
                  {children}
                </ChangeCurrentEntryProvider>
              </DiaryEntryProvider>
            </DiaryEntriesListProvider>
          </SelectedDiaryProvider>
        </DiaryNameListProvider>
      </DarkMeadContextProvider>
    </AppInitProvider>
  );
};
export default ContextProvider;
