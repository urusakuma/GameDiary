import { inject } from 'tsyringe';
import {
  IDiary,
  IDiaryEntry,
  IDiarySettings,
} from '../../model/diaryModelInterfaces';
import { MockDiaryEntry } from './mockDiaryEntry';
import { MockDiarySettings } from './mockDiarySettings';

export class MockDiary implements IDiary {
  private diaryEntries: Map<number, IDiaryEntry> = new Map();
  private settings: IDiarySettings;
  private lastDay: number = 1;

  constructor(@inject('MockKey') key?: string) {
    this.diaryEntries.set(this.lastDay, new MockDiaryEntry(this.lastDay));
    this.settings = new MockDiarySettings(key);
  }
  getSettings(): IDiarySettings {
    return this.settings;
  }

  getLastDay(): number {
    return this.lastDay;
  }

  createNewEntry(): number {
    throw new Error('createNewEntry Method not implemented.');
  }

  getEntry(day: number): IDiaryEntry {
    throw new Error(`getEntry(${day}) Method not implemented.`);
  }

  collectEntryDays(): MapIterator<number> {
    return this.diaryEntries.keys();
  }

  getNextEntry(day: number): IDiaryEntry | undefined {
    throw new Error(`getNextEntry(${day}) Method not implemented.`);
  }

  getPreviousEntry(day: number): IDiaryEntry {
    throw new Error(`getPreviousEntry(${day}) Method not implemented.`);
  }

  pruneTrailingUneditedEntries(day: number): void {
    throw new Error(
      `pruneTrailingUneditedEntries(${day}) Method not implemented.`
    );
  }

  deleteEntry(day: number): boolean {
    throw new Error(`deleteEntry(${day}) Method not implemented.`);
  }

  toJSON(): object {
    return {
      settings: this.settings,
      diaryEntries: this.diaryEntries.values().toArray(),
      lastDay: this.lastDay,
    };
  }
}
