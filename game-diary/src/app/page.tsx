'use client';

import { useState, useEffect } from 'react';

const DiaryLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* 左サイドバー */}
      <div className={`w-1/4 p-4 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="flex gap-2 mb-4">
          <button className="border p-2" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'ライトモード' : 'ダークモード'}
          </button>
          <button className="border p-2">日記名</button>
        </div>
        <div className="flex-1">リスト</div>
      </div>
      
      {/* メインエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className={`h-16 mb-2 flex justify-end items-center p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-400'}`}>
          <button className="border p-2">×</button>
        </div>
        {/* コンテンツエリア */}
        <div className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        
        {/* ボタンエリア */}
        <div className={`p-4 grid grid-cols-4 gap-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <button className="border p-2">セーブ</button>
          <button className="border p-2">エクスポート</button>
          <button className="border p-2">ロード</button>
          <button className="border p-2">インポート</button>
          <button className="border p-2 col-span-2">日記名</button>
          <button className="border p-2 col-span-2">日記期間のスライダー</button>
          {[...Array(4)].map((_, i) => (
            <button key={i} className="border p-2">日付の単位{i + 1}</button>
          ))}
          {[...Array(4)].map((_, i) => (
            <button key={i + 4} className="border p-2">日付の単位スライダー</button>
          ))}
          {[...Array(4)].map((_, i) => (
            <button key={i + 8} className="border p-2">日付の単位{i + 1}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryLayout;