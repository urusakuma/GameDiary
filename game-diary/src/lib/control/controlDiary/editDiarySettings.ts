import { inject, injectable } from 'tsyringe';
import { IEditDiarySettings } from '../controlDiaryEntry/controlDiaryEntryInterface';
import type { ICurrentDiaryAccessor } from './controlDiaryInterface';
@injectable()
export default class EditDiarySettings implements IEditDiarySettings {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  editDiaryName(name: string): void {
    this.getSettings().setDiaryName(name);
  }
  editDayInterval(interval: number): void {
    this.getSettings().updateDayInterval(interval);
  }
  editModifier(modifier: string): void {
    this.getSettings().setModifier(modifier);
  }
  editModifierCycle(cycle: number, cycleModifier: string): void {
    this.getSettings().updateModifierUnit(cycleModifier, cycle);
  }
  editCycleLength(len: number): void {
    this.getSettings().updateCycleLength(len);
  }
  private getSettings() {
    return this.diaryAccessor.getCurrentDiary().getSettings();
  }
}
