'use client';
import 'reflect-metadata';
import ContextProvider from 'src/components/context/contexts';
import { Toaster } from 'react-hot-toast';
import Sidebar from 'src/components/feature/Sidebar/Sidebar';
import Settings from 'src/components/feature/Settings/Settings';
import Header from 'src/components/feature/mainContent/Header';
import DiaryEntryContentEditor from 'src/components/feature/mainContent/DiaryEntryContentEditor';
import Background from '@shared/components/Background';
const DiaryLayout = () => {
  return (
    <ContextProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Background>
        {/* 左サイドバー */}
        <Sidebar />
        {/* メインエリア */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* ヘッダー */}
          <Header />
          {/* コンテンツエリア */}
          <DiaryEntryContentEditor />
          {/* 設定エリア */}
          <Settings />
        </div>
      </Background>
    </ContextProvider>
  );
};
export default DiaryLayout;
