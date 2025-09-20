'use client';
import useCycleLength from 'src/hooks/editSettings/useCycleLength';
import { useDarkModeContext } from '../context/darkModeContext';
import { darkInput, lightInput } from '../component_styles';
import handleEditModifierCycle from 'src/hooks/editSettings/handleEditModifierCycle';

const CycleModifier = () => {
  const { isDarkMode } = useDarkModeContext();
  const {
    cycleLength,
    cycleLengthStr,
    onChangeCycleLength,
    onChangeCycleLengthStr,
    onCycleLengthBlur,
  } = useCycleLength();
  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <h3 className="min-w-[100px]">周期単位</h3>
        <p className="text-right min-w-[180px]">
          $N:総日数　$Y:年　$D:日　$C:周期的な単位
        </p>
      </div>
      <div className={`p-4 grid grid-cols-4 gap-2`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={' flex items-left gap-2'}>
            <p key={`${i}`}>{i + 1}.</p>
            <input
              type="text"
              key={`label-${i}`}
              className={`border p-1 text-right w-4/5 ${isDarkMode ? darkInput : lightInput}`}
              defaultValue={``}
              onChange={(e) => {
                handleEditModifierCycle(i, e.target.value);
              }}
            ></input>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <input
          type="range"
          list="cycleLengthTickMarks"
          min={1}
          max={50}
          value={cycleLength}
          onChange={(e) => {
            onChangeCycleLength(Number(e.target.value));
          }}
        ></input>
        <datalist id="cycleLengthTickMarks">
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={i + 1} label={`${i + 1}`} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 10} value={10 + i * 5} label={`${10 + i * 5}`} />
          ))}
        </datalist>
        <div className="flex justify-center">
          <input
            type="text"
            className={`border p-2 text-right w-[10ch] ${isDarkMode ? darkInput : lightInput}`}
            value={cycleLengthStr}
            onChange={(e) => {
              onChangeCycleLengthStr(e.target.value);
            }}
            onBlur={(e) => {
              onCycleLengthBlur(Number(e.target.value));
            }}
          ></input>
          <p className="p-2">周期</p>
        </div>
      </div>
    </div>
  );
};

export default CycleModifier;
