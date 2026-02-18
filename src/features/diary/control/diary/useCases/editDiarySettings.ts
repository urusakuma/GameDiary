import { inject, injectable } from 'tsyringe';

import type {
  ICurrentDiaryAccessor,
  IDiaryNameService,
  IEditDiarySettings,
} from '../controlDiaryInterface';

@injectable()
export default class EditDiarySettings implements IEditDiarySettings {
  constructor(
    @inject('ICurrentDiaryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor,
    @inject('IDiaryNameService')
    private diaryNameService: IDiaryNameService
  ) {}

  editDiaryName(name: string): void {
    const uniqueName = this.diaryNameService.updateDiaryName(
      this.getSettings().storageKey,
      name
    );
    this.getSettings().setDiaryName(uniqueName);
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
