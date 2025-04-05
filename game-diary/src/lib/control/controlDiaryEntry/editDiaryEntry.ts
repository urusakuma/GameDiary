import { inject, injectable } from 'tsyringe';
import type {
  ICurrentDiaryEntryAccessor,
  IEditDiaryEntry,
} from './controlDiaryEntryInterface';
import type { ICurrentDiaryAccessor } from '../controlDiary/controlDiaryInterface';
@injectable()
export default class EditDiaryEntry implements IEditDiaryEntry {
  constructor(
    @inject('ICurrentDiaryEntryAccessor')
    private diaryEntryAccessor: ICurrentDiaryEntryAccessor,
    @inject('ICurrentDiaryEntryAccessor')
    private diaryAccessor: ICurrentDiaryAccessor
  ) {}
  editTitle(title: string): void {
    this.getEntry().setTitle(title);
  }
  editContent(content: string): void {
    this.getEntry().setContent(content);
  }
  clear(): void {
    const day = this.getEntry().day;
    const title = this.getSettings().getModifierDay(day);
    this.getEntry().setTitle(title);
    this.getEntry().setContent('');
  }
  private getEntry() {
    return this.diaryEntryAccessor.getCurrentDiaryEntry();
  }
  private getSettings() {
    return this.diaryAccessor.getCurrentDiary().getSettings();
  }
}
