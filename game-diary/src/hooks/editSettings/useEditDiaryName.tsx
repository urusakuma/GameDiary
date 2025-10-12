import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefreshContext } from 'src/components/context/useRefreshContest';
import { container } from 'tsyringe';

const useEditDiaryName = () => {
  const [diaryName, setDiaryName] = useState('');
  const prevDiaryName = useRef(diaryName);
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
    const refresh = () => {
      const currentDiaryName = diaryAccessor
        .getCurrentDiary()
        .getSettings()
        .getDiaryName();
      setDiaryName(currentDiaryName);
      prevDiaryName.current = currentDiaryName;
    };
    refresh();

    const unregister = refreshRegister(refresh);
    return unregister;
  }, [refreshRegister]);
  const editDiaryName = useCallback(
    (name: string) => {
      if (editDiarySettings === undefined) {
        return;
      }
      const isEdited = editDiarySettings.editDiaryName(name);
      if (!isEdited) {
        setDiaryName(prevDiaryName.current);
        return;
      }
      prevDiaryName.current = name;
    },
    [editDiarySettings, setDiaryName]
  );
  return { diaryName, setDiaryName, editDiaryName };
};

export default useEditDiaryName;
