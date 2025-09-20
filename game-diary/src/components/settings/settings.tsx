'use client';
import useSettingOpen from 'src/hooks/useSettingsOpen';
import DiaryName from './diaryName';
import Modifier from './modifier';
import { useDarkModeContext } from '../context/darkModeContext';
import CycleModifier from './cycleModifier';
import DayInterval from './dayInterval';

const Settings = () => {
  const { isDarkMode } = useDarkModeContext();
  const { isOpen, setIsOpen } = useSettingOpen();
  return (
    <div
      className={`grid grid-cols-[auto,300px,250px,500px] gap-2 
            overflow-hidden transition-[height] duration-300 ${isOpen ? '' : 'p-4 '}
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      style={{ height: isOpen ? '0px' : '150px' }}
    >
      {/* 設定ボタン */}
      <button
        className={`absolute ${isOpen ? 'bottom-[0px]' : 'bottom-[165px]'} transition-[bottom] duration-300  
          w-32 h-8 p-0 bg-gray-400 dark:bg-gray-600 shadow-md text-[0.7rem] flex items-end justify-center`}
        style={{
          clipPath: 'polygon(10% 50%, 90% 50%, 100% 100%, 0% 100%)',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '開く' : '閉じる'}
      </button>
      {/* 1行目: タイトル */}
      <DiaryName></DiaryName>
      {/* 2行目: 期間 */}
      <DayInterval></DayInterval>
      {/* 3行目: 日付の単位 */}
      <Modifier></Modifier>
      {/* 4行目: 周期単位 */}
      <CycleModifier></CycleModifier>
    </div>
  );
};
export default Settings;
