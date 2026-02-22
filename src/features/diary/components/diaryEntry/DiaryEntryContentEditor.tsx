'use client';
import { useEffect } from 'react';

import executeSave from '@features/diary/hooks/data/executeSave';
import {
  darkInput,
  lightInput,
} from '@features/diary/components/styles/ComponentStyles';
import { useDarkModeContext } from '@shared/components/DarkModeContext';
import { useDiaryEntryContentContext } from '@features/diary/components/diaryEntry/DiaryEntryStateProvider';
import { useModalContext } from '@features/diary/components/ui/state/ModalContext';
import { useChangeCurrentEntryContext } from '@features/diary/components/diaryEntry/ChangeCurrentEntryContext';

const DiaryEntryContentEditor = () => {
  const { isDarkMode } = useDarkModeContext();
  const { content, updateContent } = useDiaryEntryContentContext();
  const { shortcutRegister } = useModalContext();
  const { onArrowMoveEntry } = useChangeCurrentEntryContext();
  useEffect(() => {
    const unregister = shortcutRegister((e, isModal) => {
      onArrowMoveEntry(e, isModal);
      if (e.key === 's' && e.ctrlKey && isModal.home()) {
        e.preventDefault();
        executeSave();
      }
    });
    return unregister;
  }, [onArrowMoveEntry]);
  return (
    <div className="p-2 flex-1 min-h-0">
      <textarea
        className={`p-2 h-full w-full ${isDarkMode ? darkInput : lightInput}`}
        value={content}
        onChange={(e) => {
          updateContent(String(e.target.value));
        }}
      ></textarea>
    </div>
  );
};
export default DiaryEntryContentEditor;
