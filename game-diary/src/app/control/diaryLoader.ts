import { inject } from 'tsyringe';
import type {
  IDiary,
  IDiarySettings,
  NewDiaryFactory,
} from '@/model/diary/diaryModelInterfaces';
import type { IDiaryKeyMapper, IDiaryLoader } from './diaryControlInterfaces';
import type { IStorageService } from '@/model/utils/storageServiceInterface';
import type { IDiaryDecompressor } from '@/model/serialization/serializationInterface';
import { isStorageAvailable } from '@/model/utils/storageService';

export class DiaryLoader implements IDiaryLoader {
  /**現在のDiaryのKey。不明ならnullを入れる。 */
  currentDiaryKey: string | null;
  constructor(
    @inject('NewDiaryFactory')
    private diaryFactory: NewDiaryFactory,
    @inject('DiaryKeyMapper')
    private diaryKeyMapper: IDiaryKeyMapper,
    @inject('DiaryDecompressor')
    private diaryDecompressor: IDiaryDecompressor,
    @inject('IStorageService')
    private storage: IStorageService
  ) {
    if (!isStorageAvailable(this.storage)) {
      this.loadDiary = (..._: any[]) => this.createNewDiary();
    }
    //ローカルストレージからゲームデータネームリストを取得する。
    const diaryNames = this.diaryKeyMapper.collectDiaryNames();
    if (diaryNames.length <= 0) {
      // リストが存在しない場合、初めて開いたと判断してカレントにnullを入れる。
      this.currentDiaryKey = null;
      return;
    }
    // カレントのゲームデータを保存する。
    this.currentDiaryKey = this.diaryKeyMapper.getCurrentDiaryKey() ?? null;
  }
  loadDiary = (key?: string): IDiary => {
    // 指定したKeyか、現在のカレントのキーをカレントキーに入れる。
    this.currentDiaryKey = key ?? this.currentDiaryKey;
    // カレントがnullなら新しくDiaryを作成する
    if (this.currentDiaryKey === null) {
      return this.createNewDiary();
    }
    // カレントキーからカレントのデータを読み出す。読み出せなかった場合は新しくDiaryを作成する。
    const saveDataStr = this.storage.getItem(this.currentDiaryKey);
    if (saveDataStr === null) {
      return this.createNewDiary();
    }
    // カレントデータを復号して返却する。破損していた場合はエラーメッセージをそのまま投げる。
    return this.diaryDecompressor.decompressDiary(saveDataStr);
  };
  createNewDiary(settings?: IDiarySettings): IDiary {
    const diary = this.diaryFactory(settings);
    // このクラスのカレントに作成したDiaryのストレージキーを入れる。
    this.currentDiaryKey = diary.getSettings().storageKey;
    return diary;
  }
}
