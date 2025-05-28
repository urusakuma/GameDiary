'use client';
import 'reflect-metadata';
import { IDiaryDataMigrator } from '@/model/repository/diaryRepositoryInterfaces';
import '../lib/container/di_diary';
import { container } from 'tsyringe';
import { useEffect } from 'react';

const AppBootstrap = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    container.register<Storage>('LocalStorage', {
      useValue: window.localStorage,
    });
    container.resolve<IDiaryDataMigrator>('IDiaryDataMigrator').migrate();
  }, []);

  return null;
};
export default AppBootstrap;
