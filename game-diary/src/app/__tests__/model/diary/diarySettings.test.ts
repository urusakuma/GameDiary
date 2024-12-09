import { MockDayModifier } from '@/__tests__/__mocks__/mockDayModifier';
import { Constant } from '@/constant';
import {
  IDayModifier,
  IDiarySettings,
  NewDiarySettingsFactory,
  UseExistingDataDiarySettingsFactory,
} from '@/model/diary/diaryModelInterfaces';
import { DiarySettings } from '@/model/diary/diarySettings';
import { container } from 'tsyringe';

describe('DairySettings class tests', () => {
  beforeAll(() => {
    container.register<IDayModifier>('IDayModifier', {
      useClass: MockDayModifier,
    });
    container.register<string>('GAME_DATA_NAME', {
      useValue: Constant.DEFAULT_GAME_DATA_NAME,
    });
    container.register<number>('DAY_INTERVAL', {
      useValue: Constant.DEFAULT_DAY_INTERVAL,
    });
    container.register<string>('STORAGE_KEY', {
      useValue: crypto.randomUUID(),
    });
    container.register<number>('VERSION', {
      useValue: Constant.CURRENT_VERSION,
    });
    container.register<IDiarySettings>('InitDiarySettings', {
      useClass: DiarySettings,
    });
    container.register<UseExistingDataDiarySettingsFactory>(
      'UseExistingDataDiarySettingsFactory',
      {
        useFactory:
          () =>
          (
            dayModifier: IDayModifier,
            playGameDataName: string,
            dayInterval: number,
            storageKey: string,
            version: number
          ) =>
            new DiarySettings(
              dayModifier,
              playGameDataName,
              dayInterval,
              storageKey,
              version
            ),
      }
    );
    container.register<NewDiarySettingsFactory>('NewDiarySettingsFactory', {
      useFactory:
        () =>
        (
          dayModifier: IDayModifier,
          playGameDataName: string,
          dayInterval: number
        ) =>
          new DiarySettings(
            dayModifier,
            playGameDataName,
            dayInterval,
            container.resolve('STORAGE_KEY'),
            container.resolve('VERSION')
          ),
    });
  });
  test('init test', () => {
    const settings = container.resolve<IDiarySettings>('InitDiarySettings');
    // デフォルトの確認
    expect(settings.getPlayGameDataName()).toBe(
      Constant.DEFAULT_GAME_DATA_NAME
    );
    expect(settings.getCycleLength()).toBe(Constant.DEFAULT_CYCLE_LENGTH);
    expect(settings.getDayInterval()).toBe(Constant.DEFAULT_DAY_INTERVAL);
    expect(settings.getModifier()).toBe(Constant.DEFAULT_DAY_MODIFIER);
    expect(settings.getNextDay(1)).toBe(1 + Constant.DEFAULT_DAY_INTERVAL);
    expect(settings.getModifierDay(1)).toBe(
      String(1) + Constant.DEFAULT_DAY_MODIFIER
    );
    for (let i = 0; i < 3; i++) {
      expect(settings.getModifierUnit(i)).toBe('');
    }
  });
  test('set and update', () => {
    const settings = container.resolve<IDiarySettings>('InitDiarySettings');
    settings.setPlayGameDataName('テストゲーム');
    expect(settings.getPlayGameDataName()).toBe('テストゲーム');
    settings.setModifier('サイクル');
    expect(settings.getModifier()).toBe('サイクル');
    settings.updateCycleLength(15);
    expect(settings.getCycleLength()).toBe(15);
    settings.updateDayInterval(3);
    expect(settings.getDayInterval()).toBe(3);
    settings.updateModifierUnit('test', 0);
    for (let i = 0; i < 4; i++) {
      settings.updateModifierUnit('test' + String(i), i);
      expect(settings.getModifierUnit(i)).toBe('test' + String(i));
    }
    // 不正な値が入ったときは1にする。
    settings.updateDayInterval(0);
    expect(settings.getDayInterval()).toBe(1);
    // 小数点は切り捨てる
    settings.updateDayInterval(5.999);
    expect(settings.getDayInterval()).toBe(5);

    // DairySettingsは受け取った値がDayModifierに渡される場合は値の検証をしない。
    settings.updateModifierUnit('out of index', 5);
    expect(settings.getModifierUnit(5)).toBe('out of index');
    settings.updateCycleLength(-1);
    expect(settings.getCycleLength()).toBe(-1);
  });
  test('test getNextDay', () => {
    const settings = container.resolve<IDiarySettings>('InitDiarySettings');
    settings.updateDayInterval(1);
    expect(settings.getNextDay(1)).toBe(2);
    settings.updateDayInterval(3);
    expect(settings.getNextDay(10)).toBe(13);
    // 不正な値なら1日目の次の日を取得する。
    expect(settings.getNextDay(0)).toBe(4);
    // 小数は切り捨てる。
    expect(settings.getNextDay(2.999)).toBe(5);
    expect(settings.getNextDay(0.999)).toBe(4);
  });
  test('test getModifierDay', () => {
    const settings = container.resolve<IDiarySettings>('InitDiarySettings');
    settings.setModifier('日目');
    expect(settings.getModifierDay(1)).toBe('1日目');
    settings.setModifier('サイクル');
    expect(settings.getModifierDay(10)).toBe('10サイクル');
    // 不正な値なら1日目を修飾した文字列を受け取る
    expect(settings.getModifierDay(0)).toBe('1サイクル');
    // 小数は切り捨てる
    expect(settings.getModifierDay(2.999)).toBe('2サイクル');
    expect(settings.getModifierDay(0.999)).toBe('1サイクル');
  });
});
