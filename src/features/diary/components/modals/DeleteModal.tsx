'use client';
import { useCallback, useEffect } from 'react';

import useDeleteDiary from '@features/diary/hooks/data/useDeleteDiary';
import { useSelectedDiaryContext } from '@features/diary/components/diary/SelectedDiaryContext';
import { useDiaryNameListContext } from '@features/diary/components/diary/DiaryNameListContext';
import Overlay from '@features/diary/components/ui/Overlay';
import { useDarkModeContext } from '@features/diary/components/app/DarkModeContext';
import { useModalContext } from '@features/diary/components/ui/state/ModalContext';

const deleteModal = () => {
  const { selectedOption } = useSelectedDiaryContext();
  const { deleteDiary } = useDeleteDiary();
  const { getDiaryName } = useDiaryNameListContext();
  const { isDarkMode } = useDarkModeContext();
  const { go, shortcutRegister } = useModalContext();
  const handleDelete = useCallback(() => {
    deleteDiary(selectedOption);
    go.load();
  }, [deleteDiary, selectedOption]);
  useEffect(() => {
    const unregister = shortcutRegister((e) => {
      if (
        (e.key === 'Enter' || e.key === 'Delete') &&
        document.activeElement === document.body
      ) {
        handleDelete();
      }
      if (e.key === 'Backspace') {
        go.load();
      }
    });
    return unregister;
  }, [handleDelete]);
  return (
    <Overlay>
      <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2 className="text-xl font-bold mb-4">削除</h2>
        <div className=" mp-4 flex flex-col gap-2 items-start w-full">
          <p>{getDiaryName(selectedOption)}を削除しますか？</p>
          <p>※この操作は元に戻せません。</p>
        </div>
        <div className="gap-2 flex justify-start mt-4 w-full">
          <button
            className="px-4 py-2 shadow-md active:shadow-none bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            削除
          </button>
          <div className="flex-1 min-h-0">{/** 空白 */}</div>
          <button
            className={`p-4 pxa-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
            onClick={go.load}
          >
            戻る
          </button>
        </div>
      </div>
    </Overlay>
  );
};
export default deleteModal;
