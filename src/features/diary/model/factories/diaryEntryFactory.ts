import DiaryEntry from '../diaryEntry';
import {
  IDiaryEntryFactory,
  IDiaryEntry,
  IDiarySettings,
} from '../diaryModelInterfaces';

/**
 * DiaryEntryを生成するファクトリクラス
 */
export default class DiaryEntryFactory implements IDiaryEntryFactory {
  createUsePreviousDay(
    source: IDiaryEntry,
    settings: IDiarySettings
  ): IDiaryEntry {
    const today = settings.getNextDay(source.day);
    const title = settings.getModifierDay(today);
    const entry = new DiaryEntry(today, title, '', source.day, undefined);
    return entry;
  }

  createUseExistingData(
    day: number,
    title: string,
    content: string,
    previous: number | undefined,
    next: number | undefined
  ): IDiaryEntry {
    // dayは1以上の整数に補正する
    day = Math.trunc(day);
    if (day < 1) {
      day = 1;
    }
    // previousはday未満の整数に補正する
    if (previous !== undefined) {
      const prev = previous >= day ? day - 1 : Math.trunc(previous);
      previous = prev >= 1 ? prev : undefined;
    }
    // nextはdayより大きい整数に補正する
    if (next !== undefined) {
      next = next <= day ? undefined : Math.trunc(next);
    }
    return new DiaryEntry(day, title, content, previous, next);
  }
}
