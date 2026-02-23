import { inject, injectable } from 'tsyringe';

import type { IStorageService } from '@features/diary/services/persistence/storageServiceInterface';
import type { IDiary } from '@features/diary/model/diaryModelInterfaces';
import type { IDiarySave } from '@features/diary/services/persistence/diaryPersistenceInterfaces';

import type { IDiaryService } from './diaryRepositoryInterfaces';

@injectable()
export default class DiaryService implements IDiaryService {
  private diaries: Map<string, IDiary> = new Map();
  constructor(
    @inject('IDiarySave')
    private diarySave: IDiarySave,
    @inject('IStorageService') private storage: IStorageService
  ) {}
  getDiary(key: string): IDiary | undefined {
    // この関数はメモリ上のデータを返すだけでいい
    // メモリから見つからなければundefinedを返し、ストレージからの読み込みは別の責務に任せる
    return this.diaries.get(key);
  }
  addDiary(diary: IDiary): void {
    this.diaries.set(diary.getSettings().storageKey, diary);
    this.diarySave.save(diary);
  }
  deleteDiary(key: string): void {
    this.diaries.delete(key);
    this.storage.removeItem(key);
  }
}
