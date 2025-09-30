'use client';
import { useEffect } from 'react';
import executeSave from 'src/hooks/executeSave';
import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';
import { useDiaryEntryContentContext } from '../context/diaryEntryContext';
import { useModalContext } from '../context/modalContext';
import { useChangeCurrentEntryContext } from '../context/changeCurrentEntryContext';

const DiaryEntryContent = () => {
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
    <div className="p-2 flex-1">
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
export default DiaryEntryContent;
