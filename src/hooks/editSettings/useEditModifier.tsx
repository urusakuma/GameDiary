import { ICurrentDiaryAccessor } from '@/control/controlDiary/controlDiaryInterface';
import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useState, useEffect, useCallback } from 'react';
import { useRefreshContext } from 'src/components/context/useRefreshContest';
import { container } from 'tsyringe';

const useEditModifier = () => {
  const [modifier, setModifier] = useState('');
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
      const currentModifier = diaryAccessor
        .getCurrentDiary()
        .getSettings()
        .getModifier();
      setModifier(currentModifier);
    };
    refresh();
    const unregister = refreshRegister(refresh);
    return unregister;
  }, [refreshRegister]);

  const editModifier = useCallback(
    (modifier: string) => {
      if (editDiarySettings === undefined) {
        return;
      }
      editDiarySettings.editModifier(modifier);
      setModifier(modifier);
    },
    [editDiarySettings]
  );
  return { modifier, editModifier };
};

export default useEditModifier;
