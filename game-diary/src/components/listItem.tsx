import React from 'react';
import classNames from 'classnames';

interface ListItemProps {
  text: string;
  index: number;
  onRemove: () => void;
  isDarkMode: boolean;
  pendingDelete: number | null;
}

const ListItem: React.FC<ListItemProps> = ({
  text,
  index,
  onRemove,
  isDarkMode: isDarkMode,
  pendingDelete: pendingDelete,
}) => {
  return (
    <li
      className={classNames(
        'flex justify-between items-center p-2 border rounded-md shadow-md transition-colors',
        isDarkMode
          ? index % 2 === 0
            ? 'bg-gray-700'
            : 'bg-gray-800 '
          : index % 2 === 0
            ? 'bg-gray-100 '
            : 'bg-gray-200 '
      )}
    >
      <span>{text}</span>
      <button
        onClick={onRemove}
        className={classNames(
          'ml-2 p-1 w-6 h-6 flex items-center justify-center border rounded-full',

          pendingDelete === index
            ? 'bg-red-500 hover:bg-red-600'
            : isDarkMode
              ? 'bg-gray-300 hover:bg-gray-500 text-black'
              : 'bg-gray-400 hover:bg-gray-300'
        )}
      >
        ×
      </button>
    </li>
  );
};

export default ListItem;
