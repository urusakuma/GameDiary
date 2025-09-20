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
import { ICreateDiary } from '@/control/controlDiary/controlDiaryInterface';

const AppInitProvider = ({ children }: ContextWrapperProps) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    container.register<Storage>('LocalStorage', {
      useValue: window.localStorage,
    });
    container.resolve<IDiaryDataMigrator>('IDiaryDataMigrator').migrate();
    const currentKey = container
      .resolve<ICurrentDiaryManager>('ICurrentDiaryManager')
      .getCurrentDiaryKey();
    if (currentKey === '') {
      container.resolve<ICreateDiary>('ICreateDiary').createDefaultDiary();
    }
    setIsReady(true);
  }, []);
  if (!isReady) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};
export default AppInitProvider;
