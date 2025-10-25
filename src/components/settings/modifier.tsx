'use client';
import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';
import useEditModifier from 'src/hooks/editSettings/useEditModifier';

const Modifier = () => {
  const { isDarkMode } = useDarkModeContext();
  const { modifier, editModifier } = useEditModifier();

  return (
    <div>
      <h3 className="text-center">日付の単位</h3>
      <input
        type="text"
        className={`border w-full p-2 ${isDarkMode ? darkInput : lightInput}`}
        value={modifier}
        onChange={(e) => {
          editModifier(e.target.value);
        }}
      ></input>
    </div>
  );
};

export default Modifier;
