'use client';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { useEffect, useState } from 'react';

import '@features/diary/container/di_diary';
import {
  IDiaryDataMigrator,
  ICurrentDiaryManager,
} from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import ContextWrapperProps from '@shared/components/contextWrapperProps';
import useFetchHowToUse from '@features/diary/hooks/io/useFetchHowToUse';

/**
 * すべての依存関係を解決し、アプリの初期起動を行うコンポーネント
 */
const AppInitProvider = ({ children }: ContextWrapperProps) => {
  const [isReady, setIsReady] = useState(false);
  const { isRead, useReadHowToUse } = useFetchHowToUse();
  useEffect(() => {
    if (!isReady && isRead) {
      setIsReady(true);
    }
  }, [isRead]);
  useEffect(() => {
    container.register<Storage>('LocalStorage', {
      useValue: window.localStorage,
    });
    container.resolve<IDiaryDataMigrator>('IDiaryDataMigrator').migrate();
    const currentKeyManager = container.resolve<ICurrentDiaryManager>(
      'ICurrentDiaryManager'
    );
    const currentKey = currentKeyManager.getCurrentDiaryKey();
    if (currentKey !== '') {
      setIsReady(true);
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useReadHowToUse();
    } catch (e) {
      console.error(e);
    }
  }, [useReadHowToUse]);
  if (!isReady) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};
export default AppInitProvider;
