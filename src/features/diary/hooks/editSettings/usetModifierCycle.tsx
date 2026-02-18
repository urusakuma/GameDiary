import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { IEditDiarySettings } from '@features/diary/control/diary/controlDiaryInterface';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';

const useModifierCycle = () => {
  const [editDiarySettings, setEditDiarySettings] =
    useState<IEditDiarySettings>();
  const [modifierUnits, setModifierUnits] = useState<Array<string>>(
    Array(4).fill('')
  );

  const { entryRefresherRegister: refreshRegister } = useRefreshContext();
  useEffect(() => {
    const editDiarySettings =
      container.resolve<IEditDiarySettings>('IEditDiarySettings');
    setEditDiarySettings(editDiarySettings);

    const diaryAccessor = container.resolve<ICurrentDiaryAccessor>(
      'ICurrentDiaryAccessor'
    );
    const refresh = () => {
      setModifierUnits(
        modifierUnits.map((_, i) =>
          diaryAccessor.getCurrentDiary().getSettings().getModifierUnit(i)
        )
      );
    };
    refresh();
    const unregister = refreshRegister(refresh);
    return unregister;
  }, [refreshRegister]);

  const editModifierCycle = useCallback(
    (cycle: number, name: string) => {
      if (editDiarySettings === undefined) {
        return;
      }
      editDiarySettings.editModifierCycle(cycle, name);
      setModifierUnits((prev) => prev.with(cycle, name));
    },
    [editDiarySettings]
  );
  return { modifierUnits, editModifierCycle };
};
export default useModifierCycle;
