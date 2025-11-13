import 'reflect-metadata';
import type { Metadata } from 'next';
import './globals.css';
import '../lib/container/di_diary';

export const metadata: Metadata = {
  title: 'Game Diary',
  description: 'ゲームの日記をつけるアプリケーション',
  icons: {
    icon: [{ url: '/GameDiary/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
