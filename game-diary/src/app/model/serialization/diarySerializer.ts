import {
  DecompressionError,
  InvalidJsonError,
  NotSupportedError,
} from '@/error';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { hasField, isTypeMatch } from '../utils/checkTypeMatch';
import { decompressVersion00 } from './decompressVersion00';
import { decompressVersion01 } from './decompressVersion01';
import type {
  DayModifierFactory,
  DiaryFactory,
  DiarySettingsFactory,
  IDiary,
  UseExistingDataDiaryEntryFactory,
} from '../diary/diaryModelInterfaces';
import { inject, injectable } from 'tsyringe';

/**
 * IDiaryオブジェクトをJSONにシリアライズし、圧縮する。
 * @param reports シリアライズして圧縮するReport
 * @returns 圧縮されたReportの文字列
 */
export function compressDiary(reports: IDiary): string {
  const json = JSON.stringify(reports);
  const compress = compressToEncodedURIComponent(json);
  return compress;
}
@injectable()
export class DiaryDecompressor {
  constructor(
    @inject('DayModifierFactory')
    private dayModifierFactory: DayModifierFactory,
    @inject('DiarySettingsFactory')
    private diarySettingsFactory: DiarySettingsFactory,
    @inject('UseExistingDataDiaryEntryFactory')
    private diaryEntryFactory: UseExistingDataDiaryEntryFactory,
    @inject('DiaryFactory') private diaryFactory: DiaryFactory
  ) {}
  /**
   * 圧縮されたJSONをIDiaryに変換して返却する。
   * @param compressed 圧縮されたJSON文字列
   * @returns デシリアライズしたIDiary
   */
  decompressDiary(compressed: string): IDiary {
    const decompress = decompressFromEncodedURIComponent(compressed);
    if (decompress === null) {
      throw new DecompressionError('Could not decompress');
    }
    const jsonObj: unknown = JSON.parse(decompress);
    if (!isTypeMatch(jsonObj, 'object')) {
      throw new InvalidJsonError('Could not deserialize');
    }
    if (!hasField(jsonObj, 'settings', 'object')) {
      throw new InvalidJsonError('JSON is broken');
    }
    if (!hasField(jsonObj.settings, 'version', 'number')) {
      // versionが無いならv0.00
      return decompressVersion00(
        jsonObj,
        this.dayModifierFactory,
        this.diarySettingsFactory,
        this.diaryEntryFactory,
        this.diaryFactory
      );
    }
    switch (jsonObj.settings.version) {
      case 1:
        return decompressVersion01(
          jsonObj,
          this.dayModifierFactory,
          this.diarySettingsFactory,
          this.diaryEntryFactory,
          this.diaryFactory
        );
      default:
        throw new NotSupportedError(
          `version=v${jsonObj.settings.version} is not supported`
        );
    }
  }
}
