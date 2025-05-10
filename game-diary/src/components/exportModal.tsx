'use client';

import Overlay from './overlay';
import handleCopy from 'src/hooks/export/handleCopy';
import handleDownload from 'src/hooks/export/handleDownload';
import { modal, ModalProps } from './modalProps';
const ExportModal = ({ onNavigate, isDarkMode }: ModalProps) => {
  // const exportText = container
  //   .resolve<IDiaryExporter>('IDiaryExporter')
  //   .exportText();
  const exportText = 'exported data';
  return (
    <Overlay onClose={() => onNavigate(modal.Home)} isDarkMode={isDarkMode}>
      <h2 className="text-xl font-bold mb-4">エクスポート</h2>
      <textarea
        readOnly
        className={`w-full h-64 font-mono p-2 border border-gray-300 rounded resize-none ${isDarkMode ? 'bg-gray-600 border-gray-200' : 'bg-gray-300 border-gray-600'}`}
        value={exportText}
      />
      <div className="gap-2 flex justify-start mt-4">
        <button
          className={`px-4 py-2 rounded shadow-md active:shadow-none ${isDarkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'}`}
          onClick={handleCopy}
        >
          コピー
        </button>
        <button
          className="px-4 py-2 shadow-md active:shadow-none bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleDownload}
        >
          ファイル出力
        </button>
      </div>
    </Overlay>
  );
};

export default ExportModal;
