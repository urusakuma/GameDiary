'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import useCreateDiary from '@features/diary/hooks/data/useCreateDiary';
import {
  darkInput,
  lightInput,
} from '@features/diary/components/styles/ComponentStyles';
import Overlay from '@features/diary/components/ui/Overlay';
import { useDarkModeContext } from '@features/diary/components/ui/state/DarkModeContext';
import { useModalContext } from '@features/diary/components/ui/state/ModalContext';

const CreateModal = () => {
  const { newDiaryName, setNewDiaryName, createNewDiary } = useCreateDiary();
  const { isDarkMode } = useDarkModeContext();
  const { go, shortcutRegister } = useModalContext();
  const [isComposing, setIsComposing] = useState(false);
  const inputText = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => inputText.current?.focus(), 0);
  }, []);
  const handleCreate = useCallback(() => {
    createNewDiary();
    if (newDiaryName === '') {
      return;
    }
    go.load();
  }, [createNewDiary, go]);
  useEffect(() => {
    const unregister = shortcutRegister((e) => {
      if (
        e.key === 'Enter' &&
        !isComposing &&
        inputText.current === document.activeElement
      ) {
        e.preventDefault();
        handleCreate();
      }
      if (
        e.key === 'Backspace' &&
        inputText.current !== document.activeElement
      ) {
        go.load();
      }
    });
    return unregister;
  }, [go, shortcutRegister, handleCreate]);
  return (
    <Overlay>
      <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2 className="text-xl font-bold mb-4">新規作成</h2>
        <div className=" mp-4 flex flex-col gap-2 items-start w-full">
          <input
            type="text"
            ref={inputText}
            className={`p-2 w-full ${isDarkMode ? darkInput : lightInput}`}
            placeholder="新しい日記の名前"
            value={newDiaryName}
            onChange={(e) => setNewDiaryName(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          ></input>
        </div>
        <div className="gap-2 flex justify-start mt-4 w-full">
          <button
            className={`p-4 pxa-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
            onClick={handleCreate}
          >
            作成
          </button>
          <div className="flex-1 min-h-0">{/** 空白 */}</div>
          <button
            className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
            onClick={go.load}
          >
            戻る
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default CreateModal;
