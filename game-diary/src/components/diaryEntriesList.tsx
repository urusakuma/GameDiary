import { useCallback, useEffect, useState } from 'react';
import ListItem from './listItem';

const DiaryEntriesList: React.FC<{
  isDarkMode: boolean;
  onAdd: (callback: (day: number, title: string) => void) => void;
}> = ({ isDarkMode, onAdd }) => {
  // onAdd に渡すコールバック関数を useCallback でメモ化
  const addItemCallback = useCallback(
    (day: number, title: string) => {
      setItems((prevItems) => [...prevItems, { day, title }]); // 新しい要素を追加
    },
    [] // 依存配列を空にすることで、関数が再生成されないようにする
  );
  useEffect(() => {
    onAdd(addItemCallback); // 新しい要素を追加
  }, [onAdd, addItemCallback]);
  const [items, setItems] = useState<{ day: number; title: string }[]>([
    { day: 1, title: '1日目' },
  ]);
  const handleRemove = (
    index: number,
    setItems: React.Dispatch<
      React.SetStateAction<{ day: number; title: string }[]>
    >
  ) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  return (
    <ol className="max-h-[70vh] overflow-y-clip overflow-y-scroll">
      {items.map((item, index) => (
        <ListItem
          key={item.day}
          text={item.title}
          index={index}
          onRemove={() => handleRemove(index, setItems)}
          isDarkMode={isDarkMode}
        />
      ))}
    </ol>
  );
};
export default DiaryEntriesList;
