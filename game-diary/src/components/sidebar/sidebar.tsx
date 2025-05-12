import classNames from 'classnames';
import { darkButton, lightButton } from '../component_styles';
import DiaryEntriesList from './diaryEntriesList';
import handleSave from 'src/hooks/handleSave';
import ExportModal from '../modals/exportModal';
import ImportModal from '../modals/importModal';
import LoadModal from '../modals/loadModal';
import { modal } from '../modals/modalProps';
import { useState } from 'react';
import { useDarkModeContext } from '../context/darkModeContext';
const Sidebar = () => {
  const { isDarkMode, setDarkMode } = useDarkModeContext();
  const [showModal, setShowModal] = useState(modal.Home);
  return (
    <div
      className={`w-1/8 p-2 overflow-hidden flex flex-col ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
    >
      <div className="flex gap-2 mb-4 overflow-hidden">
        <button
          className={classNames(
            'border p-2 whitespace-nowrap',
            isDarkMode ? darkButton : lightButton
          )}
          onClick={() => setDarkMode(!isDarkMode)}
        >
          {isDarkMode ? 'ライトモード' : 'ダークモード'}
        </button>
      </div>
      <div className="flex-1 max-h-[72.5vh]">
        <DiaryEntriesList></DiaryEntriesList>
      </div>
      <div className={`grid grid-cols-2 gap-2`}>
        <button
          className={`overflow-hidden ${isDarkMode ? darkButton : lightButton}`}
          onClick={() => handleSave()}
        >
          セーブ
        </button>
        <button
          className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
          onClick={() => setShowModal(modal.Export)}
        >
          エクスポート
        </button>
        <button
          className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
          onClick={() => setShowModal(modal.Load)}
        >
          ロード
        </button>
        <button
          className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
          onClick={() => setShowModal(modal.Import)}
        >
          インポート
        </button>
        {showModal === modal.Export && (
          <ExportModal onNavigate={setShowModal} isDarkMode={isDarkMode} />
        )}
        {showModal === modal.Load && (
          <LoadModal onNavigate={setShowModal} isDarkMode={isDarkMode} />
        )}
        {showModal === modal.Import && (
          <ImportModal onNavigate={setShowModal} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};
export default Sidebar;
