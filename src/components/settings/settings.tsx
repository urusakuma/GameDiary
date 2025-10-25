'use client';
import useSettingOpen from 'src/hooks/useSettingsOpen';
import { useEffect, useState } from 'react';
import DiaryName from './diaryName';
import Modifier from './modifier';
import { useDarkModeContext } from '../context/darkModeContext';
import CycleModifier from './cycleModifier';
import DayInterval from './dayInterval';

const Settings = () => {
  const { isDarkMode } = useDarkModeContext();
  const { isOpen, setIsOpen } = useSettingOpen();
  const windowWidth = 1600;
  const settingsHights = [300, 150];
  const [settingsHeight, setSettingsHight] = useState<number>(
    settingsHights[0]
  );
  const [isNarrow, setIsNarrow] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= windowWidth : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${windowWidth}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setIsNarrow(e.matches);
      setSettingsHight(e.matches ? settingsHights[0] : settingsHights[1]);
    };
    setIsNarrow(mq.matches);
    setSettingsHight(mq.matches ? settingsHights[0] : settingsHights[1]);
    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  return (
    <div
      className={`gap-2 overflow-hidden transition-[height] duration-300 ${isOpen ? '' : 'p-4 '}
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      style={{
        height: isOpen ? '0px' : `${settingsHeight}px`,
        display: 'grid',
        gridTemplateColumns: isNarrow
          ? 'repeat(2, 1fr)'
          : 'auto 300px 250px 500px',
      }}
    >
      {/* 設定ボタン */}
      <button
        className={`absolute transition-[bottom] duration-300 w-32 h-8 p-0 bg-gray-400 dark:bg-gray-600 shadow-md text-[0.7rem] flex items-end justify-center`}
        style={{
          bottom: isOpen ? '15px' : `${settingsHeight + 15}px`,
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
