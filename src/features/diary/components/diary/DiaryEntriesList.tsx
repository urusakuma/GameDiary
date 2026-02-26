'use client';

import { useDarkModeContext } from '@features/diary/components/app/DarkModeContext';

import { useDiaryEntriesListContext } from './DiaryEntryListContext';
import ListItem from './DiaryEntryListItem';

const DiaryEntriesList = () => {
  const { diaryEntries, deleteEntry } = useDiaryEntriesListContext();
  const { isDarkMode } = useDarkModeContext();
  return (
    <ol className="h-full overflow-auto box-border m-0 pb-0">
      {diaryEntries.map((entry, index) => (
        <ListItem
          key={index}
          text={entry.title}
          day={entry.day}
          index={index}
          onRemove={() => deleteEntry(entry.day)}
          isDarkMode={isDarkMode}
        />
      ))}
    </ol>
  );
};
export default DiaryEntriesList;
