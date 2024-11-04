import { DiaryEntry } from '@/model/diary/diaryEntry';
import { IDiaryEntry } from '@/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';

describe('DiaryEntry class tests', () => {
  beforeAll(() =>
    container.register<IDiaryEntry>('DiaryEntry', { useClass: DiaryEntry })
  );
  test.todo('test');
});
