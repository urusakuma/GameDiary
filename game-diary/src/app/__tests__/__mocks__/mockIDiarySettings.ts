import { Constant } from '@/constant';
import { IDiarySettings } from '@/model/diary/diaryModelInterfaces';
export class MockDiarySettings implements IDiarySettings {
  get storageKey(): string {
    return 'bec0da1f-0053-4c59-acfb-f4a574bd8c98';
  }
  get version(): number {
    return 1;
  }
  setPlayGameDataName(val: string): void {}
  getPlayGameDataName(): string {
    return Constant.DEFAULT_GAME_DATA_NAME;
  }
  updateDayInterval(val: number): void {}
  getDayInterval(): number {
    return 1;
  }
  setModifier(val: string): void {}
  getModifier(): string {
    return Constant.DEFAULT_DAY_MODIFIER;
  }
  updateCycleLength(val: number): void {}
  getCycleLength(): number {
    return Constant.DEFAULT_CYCLE_LENGTH;
  }
  updateModifierUnit(unit: string, i: number): void {}

  getModifierUnit(index: number): string {
    return '';
  }
  getNextDay(day: number): number {
    return day + 1;
  }
  getModifierDay(day: number): string {
    return String(day) + Constant.DEFAULT_DAY_MODIFIER;
  }
}
