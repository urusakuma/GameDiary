import type {
  IDiary,
  IDiaryKeyMapper,
  IDiaryLoader,
  IDiarySettings,
  NewDiaryFactory,
} from './diaryInterfaces';
import { inject } from 'tsyringe';
import type { IStorageService } from './utils/storageServiceInterface';
import type { IDiaryDecompressor } from './serialization/serializationInterface';
import { isStorageAvailable } from './utils/storageService';

export class DiaryLoader implements IDiaryLoader {
  /**現在のGameDataのKey。不明ならnullを入れる。 */
  currentGameDataKey: string | null;
  constructor(
    @inject('NewDiaryFactory')
    private diaryFactory: NewDiaryFactory,
    @inject('DiaryKeyMapper')
    private diaryKeyMapper: IDiaryKeyMapper,
    @inject('DiaryDecompressor')
    private diaryDecompressor: IDiaryDecompressor,
    @inject('StorageService')
    private storage: IStorageService
  ) {
    if (!isStorageAvailable(this.storage)) {
      this.loadDiaryAsCurrent = (...v: any[]) => this.createNewDiary();
    }
    //ローカルストレージからゲームデータネームリストを取得する。
    const gameDataNames = this.diaryKeyMapper.collectGameDataNames();
    if (gameDataNames.length <= 0) {
      // リストが存在しない場合、初めて開いたと判断してnullを入れる。
      this.currentGameDataKey = null;
      return;
    }
    // カレントのゲームデータを保存する。
    this.currentGameDataKey = this.diaryKeyMapper.getCurrentGameDataKey();
    if (this.currentGameDataKey === null) {
      //currentGameDataKeyがnullならcurrentGameDataKeyが破損と判断してgameDataNamesから実在するKeyを探索する。
      //findで探しているが、現実的には一回目の探索で見つかるはず。問題になるほど大量のデータが破損されている想定はしない。
      this.currentGameDataKey =
        gameDataNames.find((v) => this.diaryKeyMapper.getGameDataKey(v)) ??
        null;
    }
  }
  loadDiaryAsCurrent = (key?: string): IDiary => {
    // 指定したKeyか、現在のカレントのキーをカレントキーに入れる。
    this.currentGameDataKey = key ?? this.currentGameDataKey;
    // カレントがnullなら新しくDiaryを作成する
    if (this.currentGameDataKey === null) {
      return this.createNewDiary();
    }
    // カレントキーからカレントのデータを読み出す。読み出せなかった場合は新しくDiaryを作成する。
    const saveDatastr = this.storage.getItem(this.currentGameDataKey);
    if (saveDatastr === null) {
      return this.createNewDiary();
    }
    // カレントデータを復号して返却する。破損していた場合はエラーメッセージをそのまま投げる。
    return this.diaryDecompressor.decompressDiary(saveDatastr);
  };
  createNewDiary(settings?: IDiarySettings): IDiary {
    const diary = this.diaryFactory(settings);
    // このクラスのカレントに作成したDiaryのストレージキーを入れる。
    this.currentGameDataKey = diary.settings.storageKey;
    return diary;
  }
}
