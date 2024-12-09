import { Constant } from '@/constant';
import { IDayModifier } from '@/model/diary/diaryModelInterfaces';
export class MockDayModifier implements IDayModifier {
  unit = Array<string>(4).fill('');
  cycleLength = Constant.DEFAULT_CYCLE_LENGTH;
  modifier = Constant.DEFAULT_DAY_MODIFIER;
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
