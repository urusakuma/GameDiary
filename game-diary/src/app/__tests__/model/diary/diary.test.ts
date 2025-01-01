import { MockDiaryEntry } from '@/__tests__/__mocks__/mockDiaryEntry';
import { MockDiarySettings } from '@/__tests__/__mocks__/mockDiarySettings';
import { Diary } from '@/model/diary/diary';
import {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
  UseExistingDataDiaryEntryFactory,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';

describe('DairySettings class tests', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register<number>('FirstDay', {
      useValue: 1,
    });
    container.register<IDiarySettings>('IDiarySettings', {
      useClass: MockDiarySettings,
    });
    container.register<IDiaryEntry>('IDiaryEntry', {
      useClass: MockDiaryEntry,
    });
    container.register<UseExistingDataDiaryEntryFactory>(
      'UseExistingDataDiaryEntryFactory',
      {
        useFactory:
          () =>
          (
            day: number,
            title: string,
            content: string,
            previous: number | undefined,
            next: number | undefined
          ) =>
            new MockDiaryEntry(day, previous, next),
      }
    );
    container.register<IDiary>('InitDiary', {
      useClass: Diary,
    });
    container.register<Map<number, IDiaryEntry>>(
      'DiaryEntriesContainingFirstDay',
      {
        useValue: new Map<number, IDiaryEntry>().set(
          container.resolve('FirstDay'),
          container.resolve('IDiaryEntry')
        ),
      }
    );
    container.register<UsePreviousDayDiaryEntryFactory>(
      'UsePreviousDayDiaryEntryFactory',
      {
        useFactory: () => (source: IDiaryEntry, settings: IDiarySettings) => {
          const day = settings.getNextDay(source.day);
          return new MockDiaryEntry(day, source.day, undefined);
        },
      }
    );
  });
  test('init test', () => {
    const diary = container.resolve<IDiary>('InitDiary');
    const diaryEntry = container.resolve<IDiaryEntry>('IDiaryEntry');
    const settings = container.resolve<IDiarySettings>('IDiarySettings');
    // デフォルトの確認
    expect(diary.getLastDay()).toBe(1);
    expect(diary.getEntry(1)).toEqual(diaryEntry);
    expect(diary.getSettings()).toEqual(settings);
  });
  test('create delete entry', () => {
    const diary = container.resolve<IDiary>('InitDiary');
    const entryFactory = container.resolve<UseExistingDataDiaryEntryFactory>(
      'UseExistingDataDiaryEntryFactory'
    );
    for (let i = 2; i < 6; i++) {
      const newDay = entryFactory(i, '', '', i - 1, undefined);
      const correctPreviousDaysDate = i !== 2 ? i - 2 : undefined;
      const oldDay = entryFactory(i - 1, '', '', correctPreviousDaysDate, i);

      expect(diary.createNewEntry()).toBe(i);
      expect(diary.getEntry(i)).toEqual(newDay);
      expect(diary.getLastDay()).toEqual(i);
      expect(diary.getEntry(i - 1)).toEqual(oldDay);
    }
    // 最終日を消去する
    expect(diary.deleteEntry(5)).toBeTruthy();
    expect(diary.getLastDay()).toEqual(4);

    // 1日目は消去できない
    expect(diary.deleteEntry(1)).toBeFalsy();
    // 2日目を削除する
    expect(diary.deleteEntry(2)).toBeTruthy();
    // 抜けた日付を埋めるようにnextとpreviousを変化させる
    expect(diary.getEntry(1).next).toBe(3);
    expect(diary.getEntry(3).previous).toBe(1);
    expect(diary.getLastDay()).toEqual(4); //最終日以外を消去しても最終日は変わらない
    //2日目を消去しようとするとエラーをスローする
    expect(() => diary.getEntry(2)).toThrow(`not exists day=2 entry`);
    expect(() => diary.deleteEntry(2)).toThrow(`not exists day=2 entry`);
    //新しく作ると最終日の後ろに追加される
    expect(diary.createNewEntry()).toBe(5);
  });
  test('JSON test', () => {
    const diaryJson =
      '{"settings":{},"diaryEntries":[{"day":1,"title":"","content":"","next":2},{"day":2,"title":"","content":"","next":3},{"day":3,"title":"","content":"","next":4},{"day":4,"title":"","content":"","next":5},{"day":5,"title":"","content":""}],"lastDay":5}';
    const diary = container.resolve<IDiary>('InitDiary');
    for (let i = 2; i < 6; i++) {
      diary.createNewEntry();
    }
    expect(JSON.stringify(diary)).toBe(diaryJson);
  });
});
