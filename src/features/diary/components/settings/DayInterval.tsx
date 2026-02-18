'use client';

import {
  darkInput,
  lightInput,
} from '@features/diary/components/styles/ComponentStyles';
import useDayInterval from '@features/diary/hooks/editSettings/useDayInterval';
import { useDarkModeContext } from '@features/diary/components/ui/state/DarkModeContext';

const DayInterval = () => {
  const { isDarkMode } = useDarkModeContext();
  const {
    dayInterval,
    dayIntervalStr,
    onChangeDayInterval,
    onChangeDayIntervalStr,
    onBlurDayInterval,
  } = useDayInterval();
  return (
    <div className="p-1r">
      <h3 className="text-center">日記の間隔</h3>
      <input
        type="range"
        list="dayIntervalTickMarks"
        min={1}
        max={100}
        value={dayInterval}
        onChange={(e) => {
          onChangeDayInterval(Number(e.target.value));
        }}
        className={`border p-2 text-center w-full ${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-gray-200 border-gray-400 text-black'}`}
      ></input>
      <datalist id="dayIntervalTickMarks">
        {/*1から15まで1刻み、15から100まで5刻みの目盛りを作成*/}
        {Array.from({ length: 15 }, (_, i) => (
          <option key={i} value={i + 1} label={`${i + 1}`} />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <option key={i + 15} value={15 + i * 5} label={`${15 + i * 5}`} />
        ))}
      </datalist>
      <div className="flex justify-center">
        <input
          type="text"
          className={`border p-2 text-right w-[10ch] ${isDarkMode ? darkInput : lightInput}`}
          value={dayIntervalStr}
          onChange={(e) => {
            onChangeDayIntervalStr(e.target.value);
          }}
          onBlur={(e) => {
            onBlurDayInterval(Number(e.target.value));
          }}
          onFocus={(e) => {
            e.target.select();
          }}
        ></input>
        <p className="p-2">毎</p>
      </div>
    </div>
  );
};
export default DayInterval;
