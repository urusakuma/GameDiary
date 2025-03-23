'use client';

import { useState, useEffect } from 'react';
import classNames from 'classnames';
import ListItem from 'src/components/listItem';
const DiaryLayout = () => {
  const [isDarkMode, setDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<string[]>(['日記1', '日記2', '日記3']);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleRemove = (index: number) => {
    if (pendingDelete === index) {
      // 2回目のクリック → 削除
      setItems(items.filter((_, i) => i !== index));
      setPendingDelete(null); // リセット
    } else {
      // 最初のクリック → 削除待ち状態にする
      setPendingDelete(index);

      // 3秒後に削除待ちを解除
      setTimeout(() => {
        setPendingDelete((prev) => (prev === index ? null : prev));
      }, 300);
    }
  };
  return (
    <div
      className={`flex h-screen p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
    >
      {/* 左サイドバー */}
      <div
        className={`w-1/8 p-2 flex flex-col ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <div className="flex gap-2 mb-4">
          <button
            className={classNames(
              'border p-2',
              isDarkMode ? darkButton : lightButton
            )}
            onClick={() => setDarkMode(!isDarkMode)}
          >
            {isDarkMode ? 'ライトモード' : 'ダークモード'}
          </button>
          <button className="p-2">日記名</button>
        </div>
        <div className="flex-1">
          <ol>
            {items.map((text, index) => (
              <ListItem
                key={index}
                text={text}
                index={index}
                onRemove={() => handleRemove(index)}
                isDarkMode={isDarkMode}
                pendingDelete={pendingDelete}
              />
            ))}
          </ol>
        </div>
        <div className={`grid grid-cols-2 gap-2`}>
          <button className={isDarkMode ? darkButton : lightButton}>
            セーブ
          </button>
          <button className={isDarkMode ? darkButton : lightButton}>
            エクスポート
          </button>
          <button className={isDarkMode ? darkButton : lightButton}>
            ロード
          </button>
          <button className={isDarkMode ? darkButton : lightButton}>
            インポート
          </button>
        </div>
      </div>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div
          className={`translate-y-1 h-16 mb-2 flex justify-end items-center p-2 gap-2`}
        >
          <input
            type="text"
            className={`p-2 h-16 mb-2 flex-1 ${isDarkMode ? darkInput : lightInput}`}
          ></input>
          <button
            className={`p-2 w-10 aspect-square ${isDarkMode ? darkButton : lightButton}`}
          >
            ×
          </button>
        </div>
        {/* コンテンツエリア */}
        <div className="p-2 flex-1">
          <textarea
            className={`p-2 h-full w-full ${isDarkMode ? darkInput : lightInput}`}
          ></textarea>
        </div>
        {/* 設定エリア */}
        <button
          className={`absolute ${isOpen ? 'bottom-[0px]' : 'bottom-[165px]'} transition-[bottom] duration-300  
          w-32 h-8 p-0 bg-gray-400 dark:bg-gray-600 shadow-md text-[0.7rem] flex items-end justify-center`}
          style={{
            clipPath: 'polygon(10% 50%, 90% 50%, 100% 100%, 0% 100%)',
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '開く' : '閉じる'}
        </button>
        <div
          className={`grid grid-cols-[auto,300px,250px,500px] gap-2 
            overflow-hidden transition-[height] duration-300 ${isOpen ? '' : 'p-4 '}
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          style={{ height: isOpen ? '0px' : '150px' }}
        >
          {/* 1行目: タイトル */}
          <div className="min-w-[200px]">
            <p className="text-center">日記の名前</p>
            <input
              type="text"
              className={`border p-2 w-full ${isDarkMode ? darkInput : lightInput}`}
              defaultValue={'日記名'}
            ></input>
          </div>

          {/* 2行目: 期間 */}
          <div className="p-1r">
            <p className="text-center">日記の間隔</p>
            <input
              type="range"
              list="tickMarks"
              min={1}
              max={100}
              className={`border p-2 text-center w-full ${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-gray-200 border-gray-400 text-black'}`}
            ></input>
            <datalist id="tickMarks">
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i} value={i + 1} label={`${i + 1}`} />
              ))}
              {Array.from({ length: 18 }, (_, i) => (
                <option
                  key={i + 15}
                  value={15 + i * 5}
                  label={`${15 + i * 5}`}
                />
              ))}
            </datalist>
            <div className="flex justify-center">
              <input
                type="text"
                className={`border p-2 text-right w-[10ch] ${isDarkMode ? darkInput : lightInput}`}
              ></input>
              <p className="p-2">毎</p>
            </div>
          </div>
          {/* 3行目: 日付の単位 */}
          <div className="">
            <p className="text-center">日付の単位</p>
            <input
              type="text"
              className={`border w-full p-2 ${isDarkMode ? darkInput : lightInput}`}
              defaultValue={'日付の単位'}
            ></input>
          </div>
          {/* 4行目: 周期単位 */}
          <div className="">
            <div className="flex items-center justify-center gap-4">
              <p className="min-w-[100px]">周期単位</p>
              <p className="text-right min-w-[180px]">
                $N:総日数　$Y:年　$D:日　$C:周期的な単位
              </p>
            </div>
            <div className={`p-4 grid grid-cols-4 gap-2`}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={classNames(` flex items-left gap-2`)}>
                  <p key={`${i}`}>{i + 1}.</p>
                  <input
                    type="text"
                    key={`label-${i}`}
                    className={`border p-1 text-right w-4/5 ${isDarkMode ? darkInput : lightInput}`}
                    defaultValue={`単位${i + 1}`}
                  ></input>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const lightButton =
  'border border-gray-400 p-2 rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 active:shadow-none';
const darkButton =
  'border border-gray-600 p-2 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 active:shadow-none';
const lightInput = 'bg-gray-300 border-gray-600';
const darkInput = 'bg-gray-600 border-gray-200';
export default DiaryLayout;
