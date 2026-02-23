'use client';
import 'reflect-metadata';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

import Background from '@features/diary/components/app/Background';
import AppProviders from '@features/diary/components/app/AppProviders';
import Sidebar from '@features/diary/components/layout/Sidebar';
import Settings from '@features/diary/components/settings/Settings';
import Header from '@features/diary/components/layout/Header';
import DiaryEntryContentEditor from '@features/diary/components/diaryEntry/DiaryEntryContentEditor';

const DiaryLayout = () => {
  return (
    <>
      <Head>
        <title>Game Diary</title>
        <meta
          name="description"
          content="ゲームの日記をつけるアプリケーション"
        />
      </Head>
      <AppProviders>
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
      </AppProviders>
    </>
  );
};
export default DiaryLayout;
