'use client';
import Overlay from './overlay';
import { ChangeEvent, useEffect, useState, useCallback, useRef } from 'react';
import useImportDiary from 'src/hooks/useImportDIary';
import { useDarkModeContext } from '../context/darkModeContext';
import { useModalContext } from '../context/modalContext';

const ImportModal = () => {
  const [textData, setTextData] = useState('');
  const { importFromFile, importFromText } = useImportDiary();
  const { isDarkMode } = useDarkModeContext();
  const { go, shortcutRegister } = useModalContext();
  const importArea = useRef<HTMLTextAreaElement>(null);

  const handleImportText = useCallback(async () => {
    await importFromText(textData);
    go.home();
  }, [importFromText, go]);

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    await importFromFile(e.target.files?.[0]);
    go.home();
  };

  useEffect(() => {
    const unregister = shortcutRegister(async (e) => {
      if (
        e.ctrlKey &&
        e.key === 'v' &&
        document.activeElement !== importArea.current
      ) {
        e.preventDefault();
        const clipText = await navigator.clipboard.readText();
        setTextData(clipText);
      }
      if (e.key === 'Enter') {
        handleImportText();
      }
    });
    return unregister;
  }, [setTextData, handleImportText, shortcutRegister]);

  return (
    <Overlay>
      <h2 className="text-xl font-bold mb-4">インポート</h2>
      <textarea
        ref={importArea}
        className={`w-full h-64 font-mono p-2 border border-gray-300 rounded resize-none ${isDarkMode ? 'bg-gray-600 border-gray-200' : 'bg-gray-300 border-gray-600'}`}
        onChange={(e) => setTextData(e.target.value)}
        value={textData}
      />
      <div className="gap-2 flex justify-start mt-4">
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={handleImportText}
        >
          インポート
        </button>
        <input
          type="file"
          accept=".txt"
          onChange={handleImportFile}
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
