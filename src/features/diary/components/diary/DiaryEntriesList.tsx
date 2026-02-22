'use client';

import { useDarkModeContext } from '@shared/components/DarkModeContext';

import { useDiaryEntriesListContext } from './DiaryEntryListContext';
import ListItem from './DiaryEntryListItem';

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
