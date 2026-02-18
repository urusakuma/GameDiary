import {
  IDiaryEntry,
  IDiarySettings,
} from '@features/diary/model/diaryModelInterfaces';
export class MockDiaryEntry implements IDiaryEntry {
  private title: string = '';
  private content: string = '';
  constructor(
    private _day: number = 1,
    private _previous: number | undefined = undefined,
    private _next: number | undefined = undefined
  ) {}
  get day(): number {
    return this._day;
  }
  setTitle(val: string): void {
    this.title = val;
  }
  getTitle(): string {
    return this.title;
  }
  setContent(val: string): void {
    this.content = val;
  }
  getContent(): string {
    return this.content;
  }
  set previous(val: number) {
    this._previous = val;
  }
  get previous(): number | undefined {
    return this._previous;
  }
  set next(val: number | undefined) {
    this._next = val;
  }
  get next(): number | undefined {
    return this._next;
  }
  isEdited(settings: IDiarySettings): boolean {
    return !(
      this.content === '' &&
      (this.title === '' || this.title === settings.getModifierDay(this.day))
    );
  }
  toJSON(): object {
    return {
      day: this.day,
      title: this.title,
      content: this.content,
      next: this.next,
    };
  }
}
