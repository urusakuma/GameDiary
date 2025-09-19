'use client';
import 'reflect-metadata';
import ContextProvider from 'src/components/context/contexts';
import { Toaster } from 'react-hot-toast';
import Sidebar from 'src/components/sidebar/sidebar';
import Settings from 'src/components/settings/settings';
import Header from 'src/components/mainContent/header';
import DiaryEntryContent from 'src/components/mainContent/diaryEntryContent';
import Background from 'src/components/background';
import { useEffect } from 'react';
import executeSave from 'src/hooks/executeSave';
const DiaryLayout = () => {
  useEffect(() => {
    const onSaveShortcut = (e: KeyboardEvent) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        executeSave();
      }
    };
    window.addEventListener('keydown', onSaveShortcut);
    return () => window.removeEventListener('keydown', onSaveShortcut);
  }, []);

  return (
    <ContextProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Background>
        {/* 左サイドバー */}
        <Sidebar />
        {/* メインエリア */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <Header />
          {/* コンテンツエリア */}
          <DiaryEntryContent />
          {/* 設定エリア */}
          <Settings />
        </div>
      </Background>
    </ContextProvider>
  );
};
export default DiaryLayout;
