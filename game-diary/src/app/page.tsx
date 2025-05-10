'use client';
import 'reflect-metadata';
import classNames from 'classnames';
import useDarkMode from 'src/hooks/useDarkMode';
import useSettingOpen from 'src/hooks/useSettingsOpen';
import DiaryEntriesList from 'src/components/diaryEntriesList';
import { useState } from 'react';
import ExportModal from 'src/components/exportModal';
import ImportModal from 'src/components/importModal';
import LoadModal from 'src/components/loadModal';
import { modal } from 'src/components/modalProps';
import ContextProvider from 'src/components/context/contexts';
import handleSave from 'src/hooks/handleSave';
import { Toaster } from 'react-hot-toast';
import handleEditContent from 'src/hooks/editDiaryEntry/handleEditContent';
import handleEditTitle from 'src/hooks/editDiaryEntry/handleEditTitle';
import handleClearDiaryEntry from 'src/hooks/editDiaryEntry/handleClearDiaryEntry';
import handleEditModifierCycle from 'src/hooks/editSettings/handleEditModifierCycle';
import handleEditModifier from 'src/hooks/editSettings/handleEditModifier';
import useCycleLength from 'src/hooks/editSettings/useCycleLength';
import useDayInterval from 'src/hooks/editSettings/useDayInterval';
const DiaryLayout = () => {
  const { isOpen, setIsOpen } = useSettingOpen();
  const { isDarkMode, setDarkMode } = useDarkMode();
  const [
    cycleLength,
    cycleLengthStr,
    handleSetCycleLength,
    handleStrToNumCycleLength,
    handleSetCycleLengthStr,
  ] = useCycleLength();
  const [
    dayInterval,
    dayIntervalStr,
    handleSetDayInterval,
    handleStrToNumDayInterval,
    handleStrDayInterval,
  ] = useDayInterval();
  const [addItem, setAddItem] = useState<(day: number, title: string) => void>(
    () => () => {}
  );
  const [showModal, setShowModal] = useState(modal.Home);
  return (
    <ContextProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div
        className={`flex h-screen p-4 overflow-y-clip overflow-x-clip overflow-x-scroll ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
      >
        {/* 左サイドバー */}
        <div
          className={`w-1/8 p-2 overflow-hidden flex flex-col ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          <div className="flex gap-2 mb-4 overflow-hidden">
            <button
              className={classNames(
                'border p-2 whitespace-nowrap',
                isDarkMode ? darkButton : lightButton
              )}
              onClick={() => setDarkMode(!isDarkMode)}
            >
              {isDarkMode ? 'ライトモード' : 'ダークモード'}
            </button>
          </div>
          <div className="flex-1 max-h-[72.5vh]">
            <DiaryEntriesList
              isDarkMode={isDarkMode}
              onAdd={(callback) => setAddItem(() => callback)}
            ></DiaryEntriesList>
          </div>
          <div className={`grid grid-cols-2 gap-2`}>
            <button
              className={`overflow-hidden ${isDarkMode ? darkButton : lightButton}`}
              onClick={() => handleSave()}
            >
              セーブ
            </button>
            <button
              className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
              onClick={() => setShowModal(modal.Export)}
            >
              エクスポート
            </button>
            <button
              className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
              onClick={() => setShowModal(modal.Load)}
            >
              ロード
            </button>
            <button
              className={`overflow-y-clip overflow-x-clip ${isDarkMode ? darkButton : lightButton}`}
              onClick={() => setShowModal(modal.Import)}
            >
              インポート
            </button>
            {showModal === modal.Export && (
              <ExportModal onNavigate={setShowModal} isDarkMode={isDarkMode} />
            )}
            {showModal === modal.Load && (
              <LoadModal onNavigate={setShowModal} isDarkMode={isDarkMode} />
            )}
            {showModal === modal.Import && (
              <ImportModal onNavigate={setShowModal} isDarkMode={isDarkMode} />
            )}
          </div>
        </div>

        {/* メインエリア */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <div
            className={`translate-y-1 h-16 mb-2 flex justify-end items-center p-2 gap-2`}
          >
            <input
              type="text"
              className={`p-2 h-16 mb-2 flex-1 ${isDarkMode ? darkInput : lightInput}`}
              onChange={(e) => handleEditTitle(e.target.value)}
            ></input>
            <button
              className={`p-2 w-10 aspect-square ${isDarkMode ? darkButton : lightButton}`}
              onClick={() => handleClearDiaryEntry()}
            >
              ×
            </button>
          </div>
          {/* コンテンツエリア */}
          <div className="p-2 flex-1">
            <textarea
              className={`p-2 h-full w-full ${isDarkMode ? darkInput : lightInput}`}
              onChange={(e) => handleEditContent(e.target.value)}
            ></textarea>
          </div>
          {/* 設定エリア */}
          <button
            className={`absolute ${isOpen ? 'bottom-[0px]' : 'bottom-[165px]'} transition-[bottom] duration-300  
          w-32 h-8 p-0 bg-gray-400 dark:bg-gray-600 shadow-md text-[0.7rem] flex items-end justify-center`}
            style={{
              clipPath: 'polygon(10% 50%, 90% 50%, 100% 100%, 0% 100%)',
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '開く' : '閉じる'}
          </button>
          <div
            className={`grid grid-cols-[auto,300px,250px,500px] gap-2 
            overflow-hidden transition-[height] duration-300 ${isOpen ? '' : 'p-4 '}
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            style={{ height: isOpen ? '0px' : '150px' }}
          >
            {/* 1行目: タイトル */}
            <div className="min-w-[200px]">
              <h3 className="text-center">日記の名前</h3>
              <input
                type="text"
                className={`border p-2 w-full ${isDarkMode ? darkInput : lightInput}`}
                defaultValue={'日記名'}
                onChange={(e) => handleEditTitle(e.target.value)}
              ></input>
            </div>

            {/* 2行目: 期間 */}
            <div className="p-1r">
              <h3 className="text-center">日記の間隔</h3>
              <input
                type="range"
                list="dayIntervalTickMarks"
                min={1}
                max={100}
                value={dayInterval}
                onChange={(e) => {
                  handleSetDayInterval(Number(e.target.value));
                }}
                className={`border p-2 text-center w-full ${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-gray-200 border-gray-400 text-black'}`}
              ></input>
              <datalist id="dayIntervalTickMarks">
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i} value={i + 1} label={`${i + 1}`} />
                ))}
                {Array.from({ length: 18 }, (_, i) => (
                  <option
                    key={i + 15}
                    value={15 + i * 5}
                    label={`${15 + i * 5}`}
                  />
                ))}
              </datalist>
              <div className="flex justify-center">
                <input
                  type="text"
                  className={`border p-2 text-right w-[10ch] ${isDarkMode ? darkInput : lightInput}`}
                  value={dayIntervalStr}
                  onChange={(e) => {
                    handleStrDayInterval(Number(e.target.value));
                  }}
                  onBlur={(e) => {
                    handleStrToNumDayInterval(Number(e.target.value));
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                ></input>
                <p className="p-2">毎</p>
              </div>
            </div>
            {/* 3行目: 日付の単位 */}
            <div className="">
              <h3 className="text-center">日付の単位</h3>
              <input
                type="text"
                className={`border w-full p-2 ${isDarkMode ? darkInput : lightInput}`}
                defaultValue={'$N日目'}
                onChange={(e) => {
                  handleEditModifier(e.target.value);
                }}
              ></input>
            </div>
            {/* 4行目: 周期単位 */}
            <div className="">
              <div className="flex items-center justify-center gap-4">
                <h3 className="min-w-[100px]">周期単位</h3>
                <p className="text-right min-w-[180px]">
                  $N:総日数　$Y:年　$D:日　$C:周期的な単位
                </p>
              </div>
              <div className={`p-4 grid grid-cols-4 gap-2`}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={classNames(` flex items-left gap-2`)}>
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
                    handleSetCycleLength(Number(e.target.value));
                  }}
                ></input>
                <datalist id="cycleLengthTickMarks">
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i + 1} label={`${i + 1}`} />
                  ))}
                  {Array.from({ length: 10 }, (_, i) => (
                    <option
                      key={i + 10}
                      value={10 + i * 5}
                      label={`${10 + i * 5}`}
                    />
                  ))}
                </datalist>
                <div className="flex justify-center">
                  <input
                    type="text"
                    className={`border p-2 text-right w-[10ch] ${isDarkMode ? darkInput : lightInput}`}
                    value={cycleLengthStr}
                    onChange={(e) => {
                      handleSetCycleLengthStr(Number(e.target.value));
                    }}
                    onBlur={(e) => {
                      handleStrToNumCycleLength(Number(e.target.value));
                    }}
                  ></input>
                  <p className="p-2">周期</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContextProvider>
  );
};
const lightButton =
  'border border-gray-400 p-2 rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 active:shadow-none';
const darkButton =
  'border border-gray-600 p-2 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 active:shadow-none';
const lightInput = 'bg-gray-300 border-gray-600';
const darkInput = 'bg-gray-600 border-gray-200';
export default DiaryLayout;
