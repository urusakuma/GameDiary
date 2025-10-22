import {
  ICreateDiary,
  IDiaryImporter,
  IDiaryLoadHandler,
} from '@/control/controlDiary/controlDiaryInterface';
import { useCallback, useState } from 'react';
import { container } from 'tsyringe';

const useFetchHowToUse = () => {
  const [isRead, setIsRead] = useState(false);

  const fetchHowToUse = useCallback(async () => {
    const path = container.resolve<string>('HOW_TO_USE_TEXT_URL');
    const res = await fetch(path);

    if (!res.ok) {
      const createDiary = container.resolve<ICreateDiary>('ICreateDiary');
      createDiary.createDefaultDiary();
      setIsRead(true);
      throw new Error('使い方の読み込みに失敗しました:' + path);
    }
    const data = await res.text();
    const importer = container.resolve<IDiaryImporter>('IDiaryImporter');
    importer.importText(data);
    setIsRead(true);
  }, []);
  const useReadHowToUse = useCallback(async (): Promise<void> => {
    const loader = container.resolve<IDiaryLoadHandler>('IDiaryLoadHandler');
    try {
      await Promise.resolve(
        loader.load(container.resolve<string>('HOW_TO_USE_KEY'))
      );
      setIsRead(true);
    } catch (e) {
      await fetchHowToUse();
    }
  }, [fetchHowToUse]);
  return { isRead, useReadHowToUse, fetchHowToUse };
};

export default useFetchHowToUse;
