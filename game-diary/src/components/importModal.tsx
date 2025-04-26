'use client';

import Overlay from './overlay';
import { Toaster } from 'react-hot-toast';
import handleCreateDiaryFromText from 'src/hooks/handleCreateDiaryFromText';
import { useState } from 'react';
import handleCreateDiaryFromFile from 'src/hooks/handleCreateDiaryFromFile';
import { modal, ModalProps } from './modalProps';

const ImportModal = ({ onNavigate, isDarkMode }: ModalProps) => {
  const [textData, setTextData] = useState('');
  return (
    <Overlay onClose={() => onNavigate(modal.Home)} isDarkMode={isDarkMode}>
      <Toaster position="bottom-center" reverseOrder={false} />
      <h2 className="text-xl font-bold mb-4">インポート</h2>
      <textarea
        className={`w-full h-64 font-mono p-2 border border-gray-300 rounded resize-none ${isDarkMode ? 'bg-gray-600 border-gray-200' : 'bg-gray-300 border-gray-600'}`}
        onChange={(e) => setTextData(e.target.value)}
      />
      <div className="gap-2 flex justify-start mt-4">
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => handleCreateDiaryFromText(textData)}
        >
          インポート
        </button>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => handleCreateDiaryFromFile(e.target.files?.[0])}
          className="hidden"
          id="file-input"
        ></input>
        <label
          htmlFor="file-input"
          className="px-4 py-2 shadow-md active:shadow-none bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ファイル読み込み
        </label>
      </div>
    </Overlay>
  );
};

export default ImportModal;
