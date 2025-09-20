'use client';
import handleEditModifier from 'src/hooks/editSettings/handleEditModifier';
import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';

const Modifier = () => {
  const { isDarkMode } = useDarkModeContext();
  return (
    <div>
      <h3 className="text-center">日付の単位</h3>
      <input
        type="text"
        className={`border w-full p-2 ${isDarkMode ? darkInput : lightInput}`}
        defaultValue={'$N日目'}
        onChange={(e) => {
          handleEditModifier(e.target.value);
        }}
      ></input>
    </div>
  );
};

export default Modifier;
