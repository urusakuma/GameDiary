'use client';

import Overlay from './overlay';
import { Toaster } from 'react-hot-toast';
import { modal, ModalProps } from './modalProps';
import handleLoad from 'src/hooks/handleLoad';
import { useState } from 'react';
import { useDiaryNameListContext } from 'src/components/context/diaryNameListContext';

const LoadModal = ({ onNavigate, isDarkMode }: ModalProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const { diaryNames } = useDiaryNameListContext();
  return (
    <Overlay onClose={() => onNavigate(modal.Home)} isDarkMode={isDarkMode}>
      <Toaster position="bottom-center" reverseOrder={false} />
      <h2 className="text-xl font-bold mb-4">ロード</h2>
      <select
        className={`w-full p-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
        onChange={(e) => {
          setSelectedOption(e.target.value);
        }}
      >
        {diaryNames.map((keyNamePair) => (
          <option key={keyNamePair.key} value={keyNamePair.key}>
            {keyNamePair.name}
          </option>
        ))}
      </select>
      <div className="gap-2 flex justify-start mt-4">
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => {
            handleLoad(selectedOption);
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
        <div className=" flex-1"></div>
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
