import DiaryEntry from './diaryEntry';
import {
  IDiaryEntryFactory,
  IDiaryEntry,
  IDiarySettings,
} from './diaryModelInterfaces';

export default class DiaryEntryFactory implements IDiaryEntryFactory {
  createUsePreviousDay(
    source: IDiaryEntry,
    settings: IDiarySettings
  ): IDiaryEntry {
    const today = settings.getNextDay(source.day);
    const title = settings.getModifierDay(today);
    const entry = new DiaryEntry(source.day, title, '', source.day, undefined);
    return entry;
  }

  createUseExistingData(
    day: number,
    title: string,
    content: string,
    previous: number | undefined,
    next: number | undefined
  ): IDiaryEntry {
    return new DiaryEntry(day, title, content, previous, next);
  }
}
