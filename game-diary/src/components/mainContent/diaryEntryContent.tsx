import { darkInput, lightInput } from '../component_styles';
import { useDarkModeContext } from '../context/darkModeContext';
import { useDiaryEntryContentContext } from '../context/diaryEntryContent';

const DiaryEntryContent = () => {
  const { isDarkMode } = useDarkModeContext();
  const { content, updateContent } = useDiaryEntryContentContext();
  return (
    <div className="p-2 flex-1">
      <textarea
        className={`p-2 h-full w-full ${isDarkMode ? darkInput : lightInput}`}
        value={content}
        onChange={(e) => {
          updateContent(String(e.target.value));
        }}
      ></textarea>
    </div>
  );
};
export default DiaryEntryContent;
