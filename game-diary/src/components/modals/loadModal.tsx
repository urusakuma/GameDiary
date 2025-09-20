'use client';
import Overlay from './overlay';
import { modal, ModalProps } from './modalProps';
import { useDiaryNameListContext } from 'src/components/context/diaryNameListContext';
import { useSelectedDiaryContext } from 'src/components/context/selectedDiaryContext';
import { useEffect } from 'react';
import useLoadDiary from 'src/hooks/useLoadDiary';

const LoadModal = ({ onNavigate, isDarkMode }: ModalProps) => {
  const { diaryNames, refreshDiaryNames } = useDiaryNameListContext();
  const { selectedOption, setSelectedOption, selectCurrentDiary } =
    useSelectedDiaryContext();
  const { load } = useLoadDiary();
  useEffect(() => {
    refreshDiaryNames();
    selectCurrentDiary();
  }, []);
  return (
    <Overlay onClose={() => onNavigate(modal.Home)} isDarkMode={isDarkMode}>
      <h2 className="text-xl font-bold mb-4">ロード</h2>
      <select
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
          onClick={() => {
            onNavigate(modal.Create);
          }}
        >
          新規作成
        </button>
        <div className=" flex-1">{/** 空白 */}</div>
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => {
            onNavigate(modal.Delete);
          }}
        >
          削除
        </button>
      </div>
    </Overlay>
  );
};

export default LoadModal;
