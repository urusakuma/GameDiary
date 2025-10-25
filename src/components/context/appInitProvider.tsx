'use client';
import 'reflect-metadata';
import {
  ICurrentDiaryManager,
  IDiaryDataMigrator,
} from '@/model/repository/diaryRepositoryInterfaces';
import '@/container/di_diary';
import { container } from 'tsyringe';
import { useEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
import useFetchHowToUse from 'src/hooks/useFetchHowToUse';

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
      useReadHowToUse();
    } catch (e) {
      console.error(e);
    }
  }, []);
  if (!isReady) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};
export default AppInitProvider;
