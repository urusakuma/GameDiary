import React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import { container } from 'tsyringe';
import { ISelectDiary } from 'src/lib/control/controlInterface';
interface ListItemProps {
  text: string;
  index: number;
  onRemove: () => void;
  isDarkMode: boolean;
}
// const selectDiaryByDate =
//   container.resolve<ISelectDiary>('ISelectDiary').byDate;
const ListItem: React.FC<ListItemProps> = ({
  text,
  index,
  onRemove,
  isDarkMode: isDarkMode,
}) => {
  const [isWaitingDelete, setIsWaitingDelete] = useState<boolean>(false);
  const pendingDeleteListItem = () => {
    if (isWaitingDelete) {
      onRemove();
    } else {
      setIsWaitingDelete(true);
      setTimeout(() => {
        setIsWaitingDelete(false);
      }, 300);
    }
  };
  return (
    <li
      onClick={() => {
        // selectDiaryByDate(index);
      }}
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
        onClick={() => pendingDeleteListItem()}
        className={classNames(
          'ml-2 p-1 w-6 h-6 flex items-center justify-center border rounded-full',

          isWaitingDelete
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
