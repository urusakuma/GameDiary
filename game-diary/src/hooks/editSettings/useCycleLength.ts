import { useState } from 'react';
import { IEditDiarySettings } from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { container } from 'tsyringe';

const useCycleLength = (): [
  number,
  number,
  (value: number) => void,
  (value: number) => void,
  (value: number) => void,
] => {
  const [cycleLength, setCycleLength] = useState(15);
  const [cycleLengthStr, setCycleLengthStr] = useState(15);
  const onCycleLengthBlur = (value: number) => {
    if (isNaN(value) || value < 1 || value > 50) {
      setCycleLengthStr(cycleLength);
      return;
    }
    onChangeCycleLength(value);
  };
  const onChangeCycleLengthStr = (value: number) => {
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
  return [
    cycleLength,
    cycleLengthStr,
    onChangeCycleLength,
    onCycleLengthBlur,
    onChangeCycleLengthStr,
  ];
};

export default useCycleLength;
