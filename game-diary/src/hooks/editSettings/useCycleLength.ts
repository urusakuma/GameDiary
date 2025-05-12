import { useState } from 'react';
import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const useCycleLength = (): {
  cycleLength: number;
  cycleLengthStr: number;
  onChangeCycleLength: (value: number) => void;
  onCycleLengthBlur: (value: number) => void;
  onChangeCycleLengthStr: (str: string) => void;
} => {
  const [cycleLength, setCycleLength] = useState(15);
  const [cycleLengthStr, setCycleLengthStr] = useState(15);
  const onCycleLengthBlur = (value: number) => {
    if (isNaN(value) || value < 1 || value > 50) {
      setCycleLengthStr(cycleLength);
      return;
    }
    onChangeCycleLength(value);
  };
  const onChangeCycleLengthStr = (str: string) => {
    const value = Number(str);
    if (isNaN(value) || value < 0) {
      return;
    }
    setCycleLengthStr(value);
  };
  const onChangeCycleLength = (value: number) => {
    if (isNaN(value) || value < 1 || value > 50) {
      return;
    }
    setCycleLength(value);
    setCycleLengthStr(value);
    try {
      const editDiarySettings =
        container.resolve<IEditDiarySettings>('IEditDiarySettings');
      editDiarySettings.editCycleLength(length);
    } catch (e) {}
  };
  return {
    cycleLength,
    cycleLengthStr,
    onChangeCycleLength,
    onChangeCycleLengthStr,
    onCycleLengthBlur,
  };
};

export default useCycleLength;
