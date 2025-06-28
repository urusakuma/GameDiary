import useClearDiaryEntry from 'src/hooks/editDiaryEntry/useClearDiaryEntry';
import {
  darkInput,
  lightInput,
  darkButton,
  lightButton,
} from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';
import {
  useDiaryEntryResetContext,
  useDiaryEntryTitleContext,
} from '../context/dairyEntry/diaryEntryContext';

const Header = () => {
  const { isDarkMode } = useDarkModeContext();
  const { title, updateTitle } = useDiaryEntryTitleContext();
  const { clear } = useDiaryEntryResetContext();
  return (
    <div
      className={`translate-y-1 h-16 mb-2 flex justify-end items-center p-2 gap-2`}
    >
      <input
        type="text"
        className={`p-2 h-16 mb-2 flex-1 ${isDarkMode ? darkInput : lightInput}`}
        value={title}
        onChange={(e) => updateTitle(e.target.value)}
      ></input>
      <button
        className={`p-2 w-10 aspect-square ${isDarkMode ? darkButton : lightButton}`}
        onClick={clear}
      >
        ×
      </button>
    </div>
  );
};
export default Header;
