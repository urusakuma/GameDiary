'use client';
import useCreateNewDiary from 'src/hooks/useCreateNewDiary';
import { darkInput, lightInput } from '../component_styles';
import { modal, ModalProps } from './modalProps';
import Overlay from './overlay';

const createModal = ({ onNavigate, isDarkMode }: ModalProps) => {
  const { newDiaryName, setNewDiaryName, createNewDiary } = useCreateNewDiary();
  return (
    <Overlay onClose={() => onNavigate(modal.Home)} isDarkMode={isDarkMode}>
      <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2 className="text-xl font-bold mb-4">新規作成</h2>
        <div className=" mp-4 flex flex-col gap-2 items-start w-full">
          <input
            type="text"
            className={`p-2 w-full ${isDarkMode ? darkInput : lightInput}`}
            placeholder="新しい日記の名前"
            value={newDiaryName}
            onChange={(e) => setNewDiaryName(e.target.value)}
          ></input>
        </div>
        <div className="gap-2 flex justify-start mt-4 w-full">
          <button
            className={`p-4 pxa-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => {
              createNewDiary();
              onNavigate(modal.Load);
            }}
          >
            作成
          </button>
          <div className=" flex-1">{/** 空白 */}</div>
          <button
            className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => onNavigate(modal.Load)}
          >
            戻る
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default createModal;
