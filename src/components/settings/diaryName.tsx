'use client';
import useEditDiaryName from 'src/hooks/editSettings/useEditDiaryName';
import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';

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
