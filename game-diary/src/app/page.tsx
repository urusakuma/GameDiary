'use client';
import 'reflect-metadata';
import ContextProvider from 'src/components/context/contexts';
import { Toaster } from 'react-hot-toast';
import Sidebar from 'src/components/sidebar/sidebar';
import Settings from 'src/components/settings/settings';
import Header from 'src/components/mainContent/header';
import DiaryEntryContent from 'src/components/mainContent/diaryEntryContent';
import Background from 'src/components/background';
const DiaryLayout = () => {
  return (
    <ContextProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Background>
        {/* 左サイドバー */}
        <Sidebar></Sidebar>
        {/* メインエリア */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <Header></Header>
          {/* コンテンツエリア */}
          <DiaryEntryContent></DiaryEntryContent>
          {/* 設定エリア */}
          <Settings></Settings>
        </div>
      </Background>
    </ContextProvider>
  );
};
export default DiaryLayout;
