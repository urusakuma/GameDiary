import DiarySettingsConstant from '@/diarySettingsConstant';
import { IDiarySettings } from '@/model/diary/diaryModelInterfaces';
import { inject, injectable } from 'tsyringe';

@injectable()
export class MockDiarySettings implements IDiarySettings {
  private _storageKey = 'bec0da1f-0053-4c59-acfb-f4a574bd8c98';
  constructor(@inject('MockKey') key?: string) {
    if (key === undefined) {
      return;
    }
    this._storageKey = key;
  }
  get storageKey(): string {
    return this._storageKey;
  }
  get version(): number {
    return 1;
  }
  setDiaryName(val: string): void {}
  getDiaryName(): string {
    return DiarySettingsConstant.DEFAULT_DIARY_NAME;
  }
  updateDayInterval(val: number): void {}
  getDayInterval(): number {
    return 1;
  }
  setModifier(val: string): void {}
  getModifier(): string {
    return DiarySettingsConstant.DEFAULT_DAY_MODIFIER;
  }
  updateCycleLength(val: number): void {}
  getCycleLength(): number {
    return DiarySettingsConstant.DEFAULT_CYCLE_LENGTH;
  }
  updateModifierUnit(unit: string, i: number): void {}

  getModifierUnit(index: number): string {
    return '';
  }
  getNextDay(day: number): number {
    return day + 1;
  }
  getModifierDay(day: number): string {
    return String(day) + DiarySettingsConstant.DEFAULT_DAY_MODIFIER;
  }
}
