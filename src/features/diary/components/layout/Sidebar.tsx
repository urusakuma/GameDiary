'use client';
import executeSave from '@features/diary/hooks/data/executeSave';
import {
  darkButton,
  lightButton,
} from '@features/diary/components/styles/ComponentStyles';
import DiaryEntriesList from '@features/diary/components/diary/DiaryEntriesList';
import { useDarkModeContext } from '@features/diary/components/app/DarkModeContext';
import { useModalContext } from '@features/diary/components/ui/state/ModalContext';

const Sidebar = () => {
  const { isDarkMode, setDarkMode } = useDarkModeContext();
  const { go } = useModalContext();
  return (
    <div
      className={`w-[12.5%] p-2 overflow-hidden flex flex-col h-[100%] min-w-[260px] ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
    >
      <div className="flex gap-2 mb-4 overflow-hidden min-h-0">
        <button
          className={`border p-2 whitespace-nowrap ${isDarkMode ? darkButton : lightButton}`}
          onClick={() => setDarkMode(!isDarkMode)}
        >
          {isDarkMode ? 'ライトモード' : 'ダークモード'}
        </button>
      </div>
      <div className="min-h-0 h-[70%] overflow-hidden">
        <DiaryEntriesList></DiaryEntriesList>
      </div>
      <div className="flex-1"></div>
      <div className={`grid grid-cols-2 gap-2 flex-none min-h-0`}>
        <button
          className={`overflow-hidden ${isDarkMode ? darkButton : lightButton}`}
          onClick={executeSave}
        >
          セーブ
        </button>
        <button
          className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
          onClick={go.export}
        >
          エクスポート
        </button>
        <button
          className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
          onClick={go.load}
        >
          ロード
        </button>
        <button
          className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
          onClick={go.import}
        >
          インポート
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
