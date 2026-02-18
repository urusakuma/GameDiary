import DiarySettingsConstant from '@features/diary/model/constants';
import { IDayModifier } from '@features/diary/model/diaryModelInterfaces';
export class MockDayModifier implements IDayModifier {
  unit = Array<string>(4);
  cycleLength = DiarySettingsConstant.DEFAULT_CYCLE_LENGTH;
  modifier = DiarySettingsConstant.DEFAULT_DAY_MODIFIER;
  setModifier(val: string): void {
    this.modifier = val;
  }
  getModifier(): string {
    return this.modifier;
  }
  updateCycleLength(val: number): void {
    this.cycleLength = val;
  }
  getCycleLength(): number {
    return this.cycleLength;
  }
  getUnit(index: number): string {
    return this.unit[index];
  }
  updateUnit(val: string, index: number): void {
    this.unit[index] = val;
  }
  modifyDay(naturalDay: number): string {
    return String(naturalDay) + this.modifier;
  }
}
