import handleClearDiaryEntry from 'src/hooks/editDiaryEntry/handleClearDiaryEntry';
import handleEditTitle from 'src/hooks/editDiaryEntry/handleEditTitle';
import {
  darkInput,
  lightInput,
  darkButton,
  lightButton,
} from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';

const Header = () => {
  const { isDarkMode } = useDarkModeContext();
  return (
    <div
      className={`translate-y-1 h-16 mb-2 flex justify-end items-center p-2 gap-2`}
    >
      <input
        type="text"
        className={`p-2 h-16 mb-2 flex-1 ${isDarkMode ? darkInput : lightInput}`}
        onChange={(e) => handleEditTitle(e.target.value)}
      ></input>
      <button
        className={`p-2 w-10 aspect-square ${isDarkMode ? darkButton : lightButton}`}
        onClick={() => handleClearDiaryEntry()}
      >
        ×
      </button>
    </div>
  );
};
export default Header;
