import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useState } from 'react';
import { container } from 'tsyringe';
const useDayInterval = (): {
  dayInterval: number;
  dayIntervalStr: number;
  onChangeDayInterval: (value: number) => void;
  onBlurDayInterval: (value: number) => void;
  onChangeDayIntervalStr: (str: string) => void;
} => {
  const [dayInterval, setDayInterval] = useState(1);
  const [dayIntervalStr, setDayIntervalStr] = useState(1);
  const onBlurDayInterval = (value: number) => {
    if (isNaN(value) || value < 1 || value > 100) {
      setDayIntervalStr(dayInterval);
      return;
    }
    try {
      const editDiarySettings =
        container.resolve<IEditDiarySettings>('IEditDiarySettings');
      editDiarySettings.editDayInterval(value);
    } catch (e) {}
    setDayInterval(value);
  };
  const onChangeDayIntervalStr = (str: string) => {
    const value = Number(str);
    if (isNaN(value) || value < 0) {
      return;
    }
    setDayIntervalStr(value);
  };
  const onChangeDayInterval = (value: number) => {
    if (isNaN(value) || value < 1 || value > 50) {
      return;
    }
    setDayInterval(value);
    setDayIntervalStr(value);
    try {
      const editDiarySettings =
        container.resolve<IEditDiarySettings>('IEditDiarySettings');
      editDiarySettings.editDayInterval(length);
    } catch (e) {}
  };
  return {
    dayInterval,
    dayIntervalStr,
    onChangeDayInterval,
    onChangeDayIntervalStr,
    onBlurDayInterval,
  };
};
export default useDayInterval;
