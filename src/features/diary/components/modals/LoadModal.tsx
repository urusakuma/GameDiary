'use client';
import { useEffect, useRef } from 'react';

import useLoadDiary from '@features/diary/hooks/data/useLoadDiary';
import { useDiaryNameListContext } from '@features/diary/components/diary/DiaryNameListContext';
import { useSelectedDiaryContext } from '@features/diary/components/diary/SelectedDiaryContext';
import { useModalContext } from '@features/diary/components/ui/state/ModalContext';
import Overlay from '@features/diary/components/ui/Overlay';
import { useDarkModeContext } from '@shared/components/DarkModeContext';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';

const LoadModal = () => {
  const { diaryNames } = useDiaryNameListContext();
  const { selectedOption, setSelectedOption, selectCurrentDiary } =
    useSelectedDiaryContext();
  const { refreshDiary } = useRefreshContext();
  const { load } = useLoadDiary();
  const { isDarkMode } = useDarkModeContext();
  const { go, shortcutRegister } = useModalContext();
  const pulldownMenu = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    selectCurrentDiary();
    refreshDiary();
    pulldownMenu.current?.focus();
  }, [selectCurrentDiary, refreshDiary, pulldownMenu]);

  useEffect(() => {
    const unregister = shortcutRegister((e) => {
      if (
        e.key === 'Enter' &&
        (document.activeElement === pulldownMenu.current ||
          document.activeElement === document.body)
      ) {
        load(selectedOption);
      }
      if ((e.ctrlKey && e.key === 'd') || e.key === 'Delete') {
        e.preventDefault();
        go.delete();
      }
    });
    return unregister;
  }, [selectedOption, load, go, shortcutRegister]);
  return (
    <Overlay>
      <h2 className="text-xl font-bold mb-4">ロード</h2>
      <select
        ref={pulldownMenu}
        className={`w-full p-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
        }}
      >
        {diaryNames.map((v) => (
          <option key={v[0]} value={v[0]}>
            {v[1]}
          </option>
        ))}
      </select>
      <div className="gap-2 flex justify-start mt-4">
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => {
            load(selectedOption);
          }}
        >
          ロード
        </button>
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={go.create}
        >
          新規作成
        </button>
        <div className="flex-1 min-h-0">{/** 空白 */}</div>
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={go.delete}
        >
          削除
        </button>
      </div>
    </Overlay>
  );
};

export default LoadModal;
