import { inject, injectable } from 'tsyringe';
import { IEditDiarySettings } from '../controlDiaryEntry/controlDiaryEntryInterface';
import type {
  ICurrentDiaryAccessor,
  IDiaryNameService,
} from './controlDiaryInterface';
@injectable()
export default class EditDiarySettings implements IEditDiarySettings {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor,
    @inject('IDiaryNameService')
    private diaryNameService: IDiaryNameService
  ) {}
  editDiaryName(name: string): boolean {
    this.getSettings().setDiaryName(name);
    const isEdited = this.diaryNameService.updateDiaryName(
      this.getSettings().storageKey,
      name
    );
    return isEdited;
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
