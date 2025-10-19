'use client';
import ListItem from './listItem';
import { useDiaryEntriesListContext } from '../context/diaryEntryListContext';
import { useDarkModeContext } from '../context/darkModeContext';

const DiaryEntriesList = () => {
  const { diaryEntries, deleteDiaryEntry } = useDiaryEntriesListContext();
  const { isDarkMode } = useDarkModeContext();
  return (
    <ol className="h-full overflow-auto box-border m-0 pb-0">
      {diaryEntries.map((entry, index) => (
        <ListItem
          key={index}
          text={entry.title}
          day={entry.day}
          index={index}
          onRemove={() => deleteDiaryEntry(entry.day)}
          isDarkMode={isDarkMode}
        />
      ))}
    </ol>
  );
};
export default DiaryEntriesList;
