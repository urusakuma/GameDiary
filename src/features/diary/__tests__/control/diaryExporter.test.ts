import DiaryExporter from '@features/diary/control/diary/useCases/diaryExporter';
import { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import { IDiaryExport } from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MockDiary } from '../__mocks__/mockDiary';

describe('DiaryExporter', () => {
  let diaryExport: jest.Mocked<IDiaryExport>;
  let accessor: jest.Mocked<ICurrentDiaryAccessor>;
  let exporter: DiaryExporter;
  const file = readFileSync(
    join(__dirname, '../__mocks__/testFileV1.txt'),
    'utf8'
  );
  const diary = new MockDiary();

  beforeEach(() => {
    diaryExport = { export: jest.fn().mockReturnValue(file) };
    accessor = {
      getCurrentDiary: jest.fn().mockReturnValue(diary),
      setCurrentDiary: jest.fn(),
    };
    exporter = new DiaryExporter(diaryExport, accessor);
  });

  it('exports the current diary text using its storage key', () => {
    expect(exporter.exportText()).toBe(file);
    expect(accessor.getCurrentDiary).toHaveBeenCalledTimes(1);
    expect(diaryExport.export).toHaveBeenCalledWith(
      diary.getSettings().storageKey
    );
  });

  it('exports a text blob named after the current diary', async () => {
    const { data, fileName } = await exporter.exportFile();
    const content = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(data);
    });
    expect(content).toBe(file);
    expect(data.type).toBe('text/plain');
    expect(fileName).toBe(diary.getSettings().getDiaryName() + '.txt');
    expect(diaryExport.export).toHaveBeenCalledWith(
      diary.getSettings().storageKey
    );
  });
});
