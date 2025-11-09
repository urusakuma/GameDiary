import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useCallback, useEffect, useState } from 'react';
import { useRefreshContext } from 'src/components/context/useRefreshContest';
import { container } from 'tsyringe';

const useEditDiaryName = () => {
  const [diaryName, setDiaryName] = useState('');
  const [diaryAccessor, setDiaryAccessor] = useState<ICurrentDiaryAccessor>();
  const [editDiarySettings, setEditDiarySettings] =
    useState<IEditDiarySettings>();
  const { entryRefresherRegister: refreshRegister } = useRefreshContext();
  useEffect(() => {
    const editDiarySettings =
      container.resolve<IEditDiarySettings>('IEditDiarySettings');
    setEditDiarySettings(editDiarySettings);
    const diaryAccessor = container.resolve<ICurrentDiaryAccessor>(
      'ICurrentDiaryAccessor'
    );
    setDiaryAccessor(diaryAccessor);
    const refresh = () => {
      const currentDiaryName = diaryAccessor
        .getCurrentDiary()
        .getSettings()
        .getDiaryName();
      setDiaryName(currentDiaryName);
    };
    refresh();

    const unregister = refreshRegister(refresh);
    return unregister;
  }, [refreshRegister]);

  const editDiaryName = useCallback(
    (name: string) => {
      if (editDiarySettings === undefined || diaryAccessor === undefined) {
        return;
      }
      editDiarySettings.editDiaryName(name);
      const currentDiaryName = diaryAccessor
        .getCurrentDiary()
        .getSettings()
        .getDiaryName();
      setDiaryName(currentDiaryName);
    },
    [editDiarySettings, setDiaryName]
  );
  return { diaryName, setDiaryName, editDiaryName };
};

export default useEditDiaryName;
