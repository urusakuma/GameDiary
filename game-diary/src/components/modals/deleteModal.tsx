import useDiaryDelete from 'src/hooks/useDIaryDelete';
import { useSelectedDiaryContext } from '../context/selectedDiaryContext';
import { modal, ModalProps } from './modalProps';
import Overlay from './overlay';
import { useDiaryNameListContext } from '../context/diaryNameListContext';

const deleteModal = ({ onNavigate, isDarkMode }: ModalProps) => {
  const { selectedOption } = useSelectedDiaryContext();
  const { deleteDiary } = useDiaryDelete();
  const { getDiaryName } = useDiaryNameListContext();
  return (
    <Overlay onClose={() => onNavigate(modal.Home)} isDarkMode={isDarkMode}>
      <div className={`modal ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2 className="text-xl font-bold mb-4">削除</h2>
        <div className=" mp-4 flex flex-col gap-2 items-start w-full">
          <p>{getDiaryName(selectedOption)}を削除しますか？</p>
          <p>※この操作は元に戻せません。</p>
        </div>
        <div className="gap-2 flex justify-start mt-4 w-full">
          <button
            className="px-4 py-2 shadow-md active:shadow-none bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              deleteDiary(selectedOption);
              onNavigate(modal.Load);
            }}
          >
            削除
          </button>
          <div className=" flex-1">{/** 空白 */}</div>
          <button
            className={`p-4 pxa-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => onNavigate(modal.Load)}
          >
            戻る
          </button>
        </div>
      </div>
    </Overlay>
  );
};
export default deleteModal;
