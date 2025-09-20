'use client';
import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';
import handleEditDiaryName from 'src/hooks/editSettings/handleEditDiaryName';

const DIaryName = () => {
  const { isDarkMode } = useDarkModeContext();
  return (
    <div className="min-w-[200px]">
      <h3 className="text-center">日記の名前</h3>
      <input
        type="text"
        className={`border p-2 w-full ${isDarkMode ? darkInput : lightInput}`}
        defaultValue={'日記名'}
        onChange={(e) => handleEditDiaryName(e.target.value)}
      ></input>
    </div>
  );
};
export default DIaryName;
