import DiarySettingsConstant from '@features/diary/model/constants';
import DiaryEntry from '@features/diary/model/diaryEntry';
import { IDiaryEntry } from '@features/diary/model/diaryModelInterfaces';
import { container } from 'tsyringe';

describe('diaryEntry class tests', () => {
  beforeAll(() => {
    container.register<number>('FIRST_DAY', {
      useValue: 1,
    });
    container.register<string>('DEFAULT_TITLE', {
      useValue:
        String(container.resolve<number>('FIRST_DAY')) +
        DiarySettingsConstant.DEFAULT_DAY_MODIFIER,
    });
    container.register<undefined>('UNDEFINED', { useFactory: () => undefined });
    container.register<string>('EMPTY_STRING', { useValue: '' });
    container.register<IDiaryEntry>('IDiaryEntry', {
      useClass: DiaryEntry,
    });
  });
  test('getUnit test', () => {
    const diaryEntry1 = container.resolve<IDiaryEntry>('IDiaryEntry');
    const diaryEntry2 = container.resolve<IDiaryEntry>('IDiaryEntry');
    expect(diaryEntry1).not.toBe(diaryEntry2);
  });
});
