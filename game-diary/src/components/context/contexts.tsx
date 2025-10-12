'use client';
import { ChangeCurrentEntryProvider } from './changeCurrentEntryContext';
import { DarkMeadContextProvider } from './darkModeContext';
import { DiaryEntriesListProvider } from './diaryEntryListContext';
import { DiaryNameListProvider } from './diaryNameListContext';
import { DiaryEntryProvider } from './diaryEntryContext';
import ContextWrapperProps from './contextWrapperProps';
import { SelectedDiaryProvider } from './selectedDiaryContext';
import AppInitProvider from './appInitProvider';
import { ModalProvider } from './modalContext';
import { RefreshProvider } from './useRefreshContest';
const ContextProvider = ({ children }: ContextWrapperProps) => {
  return (
    <AppInitProvider>
      <RefreshProvider>
        <DarkMeadContextProvider>
          <DiaryNameListProvider>
            <SelectedDiaryProvider>
              <DiaryEntriesListProvider>
                <DiaryEntryProvider>
                  <ChangeCurrentEntryProvider>
                    <ModalProvider>{children}</ModalProvider>
                  </ChangeCurrentEntryProvider>
                </DiaryEntryProvider>
              </DiaryEntriesListProvider>
            </SelectedDiaryProvider>
          </DiaryNameListProvider>
        </DarkMeadContextProvider>
      </RefreshProvider>
    </AppInitProvider>
  );
};
export default ContextProvider;
