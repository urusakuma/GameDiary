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
const ContextProvider = ({ children }: ContextWrapperProps) => {
  return (
    <AppInitProvider>
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
    </AppInitProvider>
  );
};
export default ContextProvider;
