'use client';

import ContextWrapperProps from '@shared/components/contextWrapperProps';

import { ChangeCurrentEntryProvider } from '@features/diary/components/diaryEntry/ChangeCurrentEntryContext';
import { DarkMeadContextProvider } from '@shared/components/DarkModeContext';
import { DiaryEntriesListProvider } from '@features/diary/components/diary/DiaryEntryListContext';
import { DiaryNameListProvider } from '@features/diary/components/diary/DiaryNameListContext';
import { DiaryEntryProvider } from '@features/diary/components/diaryEntry/DiaryEntryStateProvider';
import { SelectedDiaryProvider } from '@features/diary/components/diary/SelectedDiaryContext';
import { ModalProvider } from '@features/diary/components/ui/state/ModalContext';

import AppInitProvider from './AppInitProvider';
import { RefreshProvider } from './RefreshContext';

const AppProviders = ({ children }: ContextWrapperProps) => {
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
export default AppProviders;
