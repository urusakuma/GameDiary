import { IDiaryKeyMapper } from '@/control/diaryControlInterfaces';

export class MockDiaryKeyMapper implements IDiaryKeyMapper {
  private diaryNames: Map<string, string> = new Map();
  private currentDiaryKey: string | null = null;

  get length(): number {
    return this.diaryNames.size;
  }

  collectDiaryNames(): Array<string> {
    return Array.from(this.diaryNames.values());
  }

  updateDiaryName(key: string, name: string): boolean {
    if (this.diaryNames.has(key)) {
      this.diaryNames.set(key, name);
      return true;
    }
    this.diaryNames.set(key, name);
    return true;
  }

  removeDiaryName(key: string): void {
    this.diaryNames.delete(key);
  }

  getCurrentDiaryKey(): string | null {
    return this.currentDiaryKey;
  }

  setCurrentDiaryKey(key: string): void {
    this.currentDiaryKey = key;
  }

  hasDiaryName(name: string): boolean {
    return Array.from(this.diaryNames.values()).includes(name);
  }
}
