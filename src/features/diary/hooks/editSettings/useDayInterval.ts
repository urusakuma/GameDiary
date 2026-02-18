import { container } from 'tsyringe';
import { useCallback, useEffect, useState } from 'react';

import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { IEditDiarySettings } from '@features/diary/control/diary/controlDiaryInterface';
import { useRefreshContext } from '@features/diary/components/app/RefreshContext';

const useDayInterval = (): {
  dayInterval: number;
  dayIntervalStr: number;
  onChangeDayInterval: (value: number) => void;
  onBlurDayInterval: (value: number) => void;
  onChangeDayIntervalStr: (str: string) => void;
} => {
  const maxInterval = 100;
  const [dayInterval, setDayInterval] = useState(1);
  const [dayIntervalStr, setDayIntervalStr] = useState(1);
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
      const CurrentDayInterval = diaryAccessor
        .getCurrentDiary()
        .getSettings()
        .getDayInterval();
      setDayInterval(CurrentDayInterval);
      setDayIntervalStr(CurrentDayInterval);
    };
    refresh();
    const unregister = refreshRegister(refresh);
    return unregister;
  }, [refreshRegister]);
  const onBlurDayInterval = useCallback(
    (value: number) => {
      if (
        isNaN(value) ||
        value < 1 ||
        value > maxInterval ||
        editDiarySettings === undefined
      ) {
        setDayIntervalStr(dayInterval);
        return;
      }
      editDiarySettings.editDayInterval(value);
      setDayInterval(value);
    },
    [dayInterval, editDiarySettings, setDayIntervalStr, setDayInterval]
  );
  const onChangeDayIntervalStr = useCallback(
    (str: string) => {
      const value = Number(str);
      if (isNaN(value) || value < 0) {
        return;
      }
      setDayIntervalStr(value);
    },
    [setDayIntervalStr]
  );
  const onChangeDayInterval = useCallback(
    (value: number) => {
      if (
        isNaN(value) ||
        value < 1 ||
        value > maxInterval ||
        editDiarySettings === undefined
      ) {
        return;
      }
      setDayInterval(value);
      setDayIntervalStr(value);
      editDiarySettings.editDayInterval(value);
    },
    [setDayInterval, setDayIntervalStr, editDiarySettings]
  );
  return {
    dayInterval,
    dayIntervalStr,
    onChangeDayInterval,
    onChangeDayIntervalStr,
    onBlurDayInterval,
  };
};
export default useDayInterval;
