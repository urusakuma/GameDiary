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
import {
  ICreateDiary,
  IDiaryImporter,
  IDiaryLoadHandler,
} from '@/control/controlDiary/controlDiaryInterface';

const AppInitProvider = ({ children }: ContextWrapperProps) => {
  const [isReady, setIsReady] = useState(false);
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
    const path = container.resolve<string>('HOW_TO_TEXT_URL');
    fetch(path)
      .then((res) => {
        if (!res.ok) {
          const createDiary = container.resolve<ICreateDiary>('ICreateDiary');
          createDiary.createDefaultDiary();
          setIsReady(true);
          throw new Error('使い方.txtの読み込みに失敗しました:' + path);
        }
        return res.text();
      })
      .then((data) => {
        const importer = container.resolve<IDiaryImporter>('IDiaryImporter');
        importer.importText(data);
      })
      .then(() => setIsReady(true));
  }, []);
  if (!isReady) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};
export default AppInitProvider;
