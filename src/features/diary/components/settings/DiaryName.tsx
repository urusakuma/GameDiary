'use client';

import {
  darkInput,
  lightInput,
} from '@features/diary/components/styles/ComponentStyles';
import useEditDiaryName from '@features/diary/hooks/editSettings/useEditDiaryName';
import { useDarkModeContext } from '@features/diary/components/app/DarkModeContext';

const DIaryName = () => {
  const { isDarkMode } = useDarkModeContext();
  const { diaryName, setDiaryName, editDiaryName } = useEditDiaryName();

  return (
    <div className="min-w-[200px]">
      <h3 className="text-center">日記の名前</h3>
      <input
        type="text"
        className={`border p-2 w-full ${isDarkMode ? darkInput : lightInput}`}
        value={diaryName}
        onChange={(e) => setDiaryName(e.target.value)}
        onBlur={(e) => editDiaryName(e.target.value)}
      ></input>
    </div>
  );
};
export default DIaryName;
