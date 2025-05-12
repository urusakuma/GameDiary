import ListItem from './listItem';
import { useDiaryEntriesListContext } from '../context/diaryEntryListContext';
import { useDarkModeContext } from '../context/darkModeContext';

const DiaryEntriesList = () => {
  const { diaryEntries, removeDiaryEntry } = useDiaryEntriesListContext();
  const { isDarkMode } = useDarkModeContext();
  return (
    <ol className="max-h-[70vh] overflow-y-clip overflow-y-scroll">
      {diaryEntries.map((entry, index) => (
        <ListItem
          key={entry.day}
          text={entry.title}
          index={index}
          onRemove={() => removeDiaryEntry(entry.day)}
          isDarkMode={isDarkMode}
        />
      ))}
    </ol>
  );
};
export default DiaryEntriesList;
