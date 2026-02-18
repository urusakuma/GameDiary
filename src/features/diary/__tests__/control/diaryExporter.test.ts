import 'reflect-metadata';
import { container } from 'tsyringe';
import DiaryExporter from '@features/diary/control/diary/useCases/diaryExporter';
import type { ICurrentDiaryAccessor } from '@features/diary/control/diary/controlDiaryInterface';
import DiaryExport from '@features/diary/services/persistence/diaryExport';
import fs from 'fs';
import { MockDiary } from '@features/diary/__tests__/__mocks__/mockDiary';

describe('DiaryExporter Constructor', () => {
  let mockDiaryExport: jest.Mocked<DiaryExport>;
  let mockDiaryAccessor: jest.Mocked<ICurrentDiaryAccessor>;
  const fileStr = fs.readFileSync('/app/testFileV1.txt', 'utf8');
  const mockDiary = new MockDiary();
  const mockDiarySettings = mockDiary.getSettings();

  beforeEach(() => {
    mockDiaryExport = {
      export: jest.fn().mockReturnValue(fileStr),
    } as unknown as jest.Mocked<DiaryExport>;

    mockDiaryAccessor = {
      getCurrentDiary: jest.fn().mockReturnValue(mockDiary),
    } as unknown as jest.Mocked<ICurrentDiaryAccessor>;

    container.registerInstance('IDiaryExporter', mockDiaryExport);
    container.registerInstance('ICurrentDiaryAccessor', mockDiaryAccessor);
    container.register('DiaryExporter', { useClass: DiaryExporter });
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should export the current diary text based on storageKey', () => {
    const diaryExporter = container.resolve<DiaryExporter>('DiaryExporter');
    const diaryStr = diaryExporter.exportText();
    expect(diaryStr).toBe(fileStr);
    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryExport.export).toHaveBeenCalledWith(
      mockDiary.getSettings().storageKey
    );
  });
  it('should export the current diary file based on storageKey', async () => {
    const diaryExporter = container.resolve<DiaryExporter>('DiaryExporter');
    const [diaryBlob, fileName] = diaryExporter.exportFile();
    expect(await diaryBlob.text()).toBe(fileStr);
    expect(fileName).toBe(`${mockDiarySettings.getDiaryName()}.txt`);
    expect(mockDiaryAccessor.getCurrentDiary).toHaveBeenCalled();
    expect(mockDiaryExport.export).toHaveBeenCalledWith(
      mockDiary.getSettings().storageKey
    );
  });
});
