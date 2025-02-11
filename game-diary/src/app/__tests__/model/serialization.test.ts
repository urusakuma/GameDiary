import { DayModifier } from '@/model/diary/dayModifier';
import { Diary } from '@/model/diary/diary';
import { DiaryEntry } from '@/model/diary/diaryEntry';
import {
  DayModifierFactory,
  UseExistingDataDiaryEntryFactory,
  DiaryFactory,
  UseExistingDataDiarySettingsFactory,
  IDayModifier,
  IDiaryEntry,
  IDiarySettings,
  IDiary,
  UsePreviousDayDiaryEntryFactory,
} from '@/model/diary/diaryModelInterfaces';
import { DiarySettings } from '@/model/diary/diarySettings';
import {
  compressDiary,
  DiaryDecompressor,
} from '@/model/serialization/diarySerializer';
import { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import {
  hasField,
  isArrayType,
  isTypeMatch,
} from '@/model/utils/checkTypeMatch';
import { readFileSync } from 'fs';
import { container } from 'tsyringe';
import { MockDiarySettings } from '../__mocks__/mockDiarySettings';
import { MockDiaryEntry } from '../__mocks__/mockDiaryEntry';
import { compressToEncodedURIComponent } from 'lz-string';

describe('serialization test', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register<DayModifierFactory>('DayModifierFactory', {
      useFactory:
        () =>
        (modifier: string, cycleLength: number, ...unit: Array<string>) =>
          new DayModifier(modifier, cycleLength, ...unit),
    });
    container.register<UseExistingDataDiarySettingsFactory>(
      'UseExistingDataDiarySettingsFactory',
      {
        useFactory:
          () =>
          (
            dayModifier: IDayModifier,
            DiaryName: string,
            dayInterval: number,
            storageKey: string,
            version: number
          ) =>
            new DiarySettings(
              dayModifier,
              DiaryName,
              dayInterval,
              storageKey,
              version
            ),
      }
    );
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
    container.register<DiaryFactory>('DiaryFactory', {
      useFactory:
        () =>
        (
          diaryEntries: Map<number, IDiaryEntry>,
          settings: IDiarySettings,
          lastDay: number
        ) =>
          new Diary(
            container.resolve('UseExistingDataDiaryEntryFactory'),
            diaryEntries,
            settings,
            lastDay
          ),
    });
    container.register<IDiaryDecompressor>('IDiaryDecompressor', {
      useClass: DiaryDecompressor,
    });
    container.register<number>('FirstDay', {
      useValue: 1,
    });
    container.register<IDiaryEntry>('IDiaryEntry', {
      useClass: MockDiaryEntry,
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
    container.register<IDiarySettings>('IDiarySettings', {
      useClass: MockDiarySettings,
    });
    container.register<UsePreviousDayDiaryEntryFactory>(
      'UsePreviousDayDiaryEntryFactory',
      {
        useFactory: () => (source: IDiaryEntry, settings: IDiarySettings) => {
          const newDay = settings.getNextDay(source.day);
          return new DiaryEntry(
            newDay,
            settings.getModifierDay(newDay),
            '',
            source.day,
            undefined
          );
        },
      }
    );
    container.register<IDiary>('IDiary', { useClass: Diary });
  });
  test('checkTypeMatch', () => {
    expect(isTypeMatch(false, 'boolean')).toBeTruthy();
    expect(isTypeMatch(0, 'number')).toBeTruthy();
    expect(isTypeMatch('文字列', 'string')).toBeTruthy();
    expect(isTypeMatch(new Object(), 'object')).toBeTruthy();
    expect(isTypeMatch([0, 1, 2, 3, 4, 5], 'object')).toBeTruthy();
    expect(isTypeMatch([0, 1, 2, 3, 4, 5], 'Array')).toBeTruthy();

    expect(isTypeMatch(new Object(), 'number')).toBeFalsy();
    expect(isTypeMatch(new Map(), 'Array')).toBeFalsy();

    class Hoge {
      hogeNum = 1;
      hogeStr = 'str';
      hogeBool = true;
      hogObj = new Object();
      hogeArr = [0, 1, 2];
    }
    const hoge = new Hoge();
    expect(hasField(hoge, 'hogeNum', 'number')).toBeTruthy();
    expect(hasField(hoge, 'hogeStr', 'string')).toBeTruthy();
    expect(hasField(hoge, 'hogeBool', 'boolean')).toBeTruthy();
    expect(hasField(hoge, 'hogObj', 'object')).toBeTruthy();
    expect(hasField(hoge, 'hogeArr', 'object')).toBeTruthy();
    expect(hasField(hoge, 'hogeArr', 'Array')).toBeTruthy();
    expect(isArrayType(hoge.hogeArr, 'number')).toBeTruthy();

    expect(hasField(hoge, 'hogeNum', 'Array')).toBeFalsy();
    expect(hasField(hoge, 'hogeArr', 'number')).toBeFalsy();
    expect(isArrayType(hoge.hogeArr, 'string')).toBeFalsy();
  });
  test('serialization', () => {
    const diary = container.resolve<IDiary>('IDiary');
    diary.getEntry(1).setContent(`1日目の記録`);
    diary.getEntry(1).setTitle(`1日目`);
    for (let i = 0; i < 5; i++) {
      const day = diary.createNewEntry();
      diary.getEntry(day).setContent(`${day}日目の記録`);
    }
    const json = JSON.stringify(diary);
    const compressJson = compressToEncodedURIComponent(json);
    expect(compressDiary(diary)).toBe(compressJson);
  });
  // 正常系のテストしかしていない。セーブデータを弄られることを想定していないため。
  test('deserialization v0', () => {
    const fileName = '/app/v0CompressionFile.txt';
    deserialization(fileName);
  });
  // 正常系のテストしかしていない。セーブデータを弄られることを想定していないため。
  test('deserialization v1', () => {
    const fileName = '/app/v1CompressionFile.txt';
    deserialization(fileName);
  });
  function deserialization(fileName: string) {
    const file = readFileSync(fileName).toString();
    const diaryDecompressor =
      container.resolve<IDiaryDecompressor>('IDiaryDecompressor');
    const diary = diaryDecompressor.decompressDiary(file);
    // セーブデータによらず最新のバージョンになる
    expect(diary.getSettings().version).toBe(1);
    // 正確に読み込めているかのテスト
    expect(diary.getSettings().storageKey).toBe(
      'c47f8ff6-46ad-49c3-acdc-5f63e18b1583'
    );
    expect(diary.getEntry(1).previous).toBe(undefined);
    expect(diary.getEntry(1).getTitle()).toBe('1サイクル目');
    expect(diary.getEntry(1).getContent()).toBe(
      '左方向と下方向に水。左方向の水をトイレに使用する。'
    );
    expect(diary.getLastDay()).toBe(136);
    expect(diary.getEntry(136).getTitle()).toBe('136サイクル目');
    expect(diary.getEntry(136).getContent()).toBe(
      'スウィートルを貰う。即お肉に変換。\n'
    );
    expect(diary.getEntry(133).next).toBe(136);
    expect(diary.getEntry(133).previous).toBe(130);
    expect(diary.getEntry(136).next).toBe(undefined);
  }
});
