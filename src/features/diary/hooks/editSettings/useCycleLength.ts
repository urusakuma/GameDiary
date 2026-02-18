import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

import { IEditDiarySettings } from '@features/diary/control/diary/controlDiaryInterface';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';

const useCycleLength = (): {
  cycleLength: number;
  cycleLengthStr: number;
  onChangeCycleLength: (value: number) => void;
  onCycleLengthBlur: (value: number) => void;
  onChangeCycleLengthStr: (str: string) => void;
} => {
  const [cycleLength, setCycleLength] = useState(15);
  const [cycleLengthStr, setCycleLengthStr] = useState(15);
  const [editSettings, setEditSettings] = useState<IEditDiarySettings>();
  const { entryRefresherRegister: refreshRegister } = useRefreshContext();
  const maxLength = 50;
  useEffect(() => {
    const editSettings =
      container.resolve<IEditDiarySettings>('IEditDiarySettings');
    setEditSettings(editSettings);
    const diaryAccessor = container.resolve<ICurrentDiaryAccessor>(
      'ICurrentDiaryAccessor'
    );
    const refresh = () => {
      const currentCycleLen = diaryAccessor
        .getCurrentDiary()
        .getSettings()
        .getCycleLength();
      setCycleLength(currentCycleLen);
      setCycleLengthStr(currentCycleLen);
    };
    refresh();
    const unregister = refreshRegister(refresh);
    return unregister;
  }, [refreshRegister]);
  const onChangeCycleLengthStr = useCallback(
    (str: string) => {
      const value = Number(str);
      if (isNaN(value) || value < 0) {
        return;
      }
      setCycleLengthStr(value);
    },
    [setCycleLengthStr]
  );
  const onChangeCycleLength = useCallback(
    (value: number) => {
      if (
        isNaN(value) ||
        value < 1 ||
        value > maxLength ||
        editSettings === undefined
      ) {
        return;
      }
      setCycleLength(value);
      setCycleLengthStr(value);

      editSettings.editCycleLength(value);
    },
    [editSettings]
  );
  const onCycleLengthBlur = useCallback(
    (value: number) => {
      if (isNaN(value) || value < 1 || value > maxLength) {
        setCycleLengthStr(cycleLength);
        return;
      }
      onChangeCycleLength(value);
    },
    [cycleLength, onChangeCycleLength]
  );
  return {
    cycleLength,
    cycleLengthStr,
    onChangeCycleLength,
    onChangeCycleLengthStr,
    onCycleLengthBlur,
  };
};

export default useCycleLength;
