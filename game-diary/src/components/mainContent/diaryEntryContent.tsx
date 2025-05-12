import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';
import handleEditContent from 'src/hooks/editDiaryEntry/handleEditContent';

const DiaryEntryContent = () => {
  const { isDarkMode } = useDarkModeContext();
  return (
    <div className="p-2 flex-1">
      <textarea
        className={`p-2 h-full w-full ${isDarkMode ? darkInput : lightInput}`}
        onChange={(e) => handleEditContent(e.target.value)}
      ></textarea>
    </div>
  );
};
export default DiaryEntryContent;
