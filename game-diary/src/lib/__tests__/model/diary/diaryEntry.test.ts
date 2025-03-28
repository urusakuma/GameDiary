import { MockDiarySettings } from 'src/lib/__tests__/__mocks__/mockDiarySettings';
import { DairySettingsConstant } from 'src/lib/dairySettingsConstant';
import { DiaryEntry } from 'src/lib/model/diary/diaryEntry';
import {
  IDiaryEntry,
  IDiarySettings,
  UseExistingDataDiaryEntryFactory,
  UsePreviousDayDiaryEntryFactory,
} from 'src/lib/model/diary/diaryModelInterfaces';
import { container } from 'tsyringe';

describe('DiaryEntry class tests', () => {
  beforeAll(() => {
    container.register<IDiaryEntry>('InitDiaryEntry', {
      useClass: DiaryEntry,
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
            new DiaryEntry(day, title, content, previous, next),
      }
    );
    container.register<UsePreviousDayDiaryEntryFactory>(
      'UsePreviousDayDiaryEntryFactory',
      {
        useFactory: () => (source: IDiaryEntry, settings: IDiarySettings) =>
          new DiaryEntry(
            settings.getNextDay(source.day),
            settings.getModifierDay(settings.getNextDay(source.day)),
            '',
            source.day,
            undefined
          ),
      }
    );
    container.register<IDiarySettings>('MockSettings', {
      useClass: MockDiarySettings,
    });
  });
  test('init test', () => {
    const entry = container.resolve<IDiaryEntry>('InitDiaryEntry');
    // デフォルトの確認
    expect(entry.day).toBe(1);
    expect(entry.getTitle()).toBe(
      '1' + DairySettingsConstant.DEFAULT_DAY_MODIFIER
    );
    expect(entry.getContent()).toBe('');
    expect(entry.previous).toBe(undefined);
    expect(entry.next).toBe(undefined);
  });
  test('set function', () => {
    const entry = container.resolve<IDiaryEntry>('InitDiaryEntry');
    // setメソッドの確認
    const setTitle = '1日目 テストをしてみる';
    entry.setTitle(setTitle);
    expect(entry.getTitle()).toBe(setTitle);
    const setContent = 'テストを書いてみる';
    entry.setContent(setContent);
    expect(entry.getContent()).toBe(setContent);
  });
  test('next, previous', () => {
    const entry = container.resolve<IDiaryEntry>('InitDiaryEntry');
    // next, previousの確認少数を渡されたときに切り捨てているかチェック
    entry.next = 0.999;
    expect(entry.next).toBe(undefined);
    entry.next = 1.999;
    expect(entry.next).toBe(undefined);
    entry.next = 2.999;
    expect(entry.next).toBe(2);
    entry.previous = 0.999;
    expect(entry.previous).toBe(undefined);
    entry.previous = 1.999;
    expect(entry.previous).toBe(undefined);
  });
  test('isEdited function', () => {
    const entry = container.resolve<IDiaryEntry>('InitDiaryEntry');
    const settings = container.resolve<IDiarySettings>('MockSettings');
    // タイトルが初期状態で、内容が空になっている
    expect(entry.isEdited(settings)).toBeFalsy();
    const setTitle = '1日目 テストをしてみる';
    entry.setTitle(setTitle);
    const setContent = 'テストを書いてみる';
    entry.setContent(setContent);
    // タイトルと内容どちらにも書き込まれている
    expect(entry.isEdited(settings)).toBeTruthy();
    entry.setContent('');
    // タイトルが書き込まれ、内容が空になっている
    expect(entry.isEdited(settings)).toBeTruthy();
    entry.setTitle('');
    // タイトルと内容どちらにも書き込まれていない
    expect(entry.isEdited(settings)).toBeFalsy();
    entry.setContent(setContent);
    // 内容が書き込まれ、タイトルが空になっている
    expect(entry.isEdited(settings)).toBeTruthy();
  });
  test('use factory', () => {
    const settings = container.resolve<IDiarySettings>('MockSettings');
    const existingDataDiaryEntryFactory =
      container.resolve<UseExistingDataDiaryEntryFactory>(
        'UseExistingDataDiaryEntryFactory'
      );
    const entryFactory = container.resolve<UsePreviousDayDiaryEntryFactory>(
      'UsePreviousDayDiaryEntryFactory'
    );
    const entries: Array<IDiaryEntry> = [];
    entries.push(
      existingDataDiaryEntryFactory(
        1,
        '1日目', // TODO: Constantを使用する
        'テストです',
        undefined,
        undefined
      )
    );
    const entryNum = 5;
    for (let i = 1; i < entryNum; i++) {
      entries.push(entryFactory(entries[i - 1], settings));
    }
    for (let i = 0; i < entryNum; i++) {
      const nowDay = i + 1;
      expect(entries[i].day).toBe(nowDay);
      expect(entries[i].getTitle()).toBe(settings.getModifierDay(nowDay));
      if (i === 0) {
        expect(entries[i].getContent()).toBe('テストです');
        expect(entries[i].isEdited(settings)).toBeTruthy();
      } else {
        expect(entries[i].getContent()).toBe('');
        expect(entries[i].isEdited(settings)).toBeFalsy();
        expect(entries[i].previous).toBe(nowDay - 1);
      }
      // factoryはnextを更新しないため注意。factoryの使用者が責任を持ってnextを更新すること。
      expect(entries[i].next).toBe(undefined);
    }
    // entries[4].day === 5
    // previousに新しい数字を入れたとき少数を切り捨てて自分より小さい数字かつ1以上に数字を受け入れているかチェック
    entries[4].previous = 6;
    expect(entries[4].previous).toBe(4);
    entries[4].previous = 5;
    expect(entries[4].previous).toBe(4);
    entries[4].previous = 3.999;
    expect(entries[4].previous).toBe(3);
    entries[4].previous = 4;
    expect(entries[4].previous).toBe(4);
    entries[4].previous = 0;
    expect(entries[4].previous).toBe(4);
    entries[4].previous = 0.999;
    expect(entries[4].previous).toBe(4);
  });
});
