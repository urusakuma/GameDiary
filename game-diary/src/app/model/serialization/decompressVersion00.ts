import { DairySettingsConstant } from '@/constant';
import { InvalidJsonError } from '@/error';
import {
  DayModifierFactory,
  DiaryFactory,
  UseExistingDataDiarySettingsFactory,
  IDiary,
  IDiaryEntry,
  UseExistingDataDiaryEntryFactory,
} from '../diary/diaryModelInterfaces';
import { hasField, isArrayType, isTypeMatch } from '../utils/checkTypeMatch';

/**
 * 最初に作られたバージョンのデータをインポートするための関数。
 * settings.versionはundefined
 * @param jsonObj
 * @returns
 */
export function decompressVersion00(
  jsonObj: object,
  dayModifierFactory: DayModifierFactory,
  diarySettingsFactory: UseExistingDataDiarySettingsFactory,
  diaryEntryFactory: UseExistingDataDiaryEntryFactory,
  diaryFactory: DiaryFactory
): IDiary {
  if (!hasField(jsonObj, 'lastDay', 'number')) {
    throw new InvalidJsonError('Diary class is broken');
  }
  if (
    !hasField(jsonObj, 'settings', 'object') ||
    !hasField(jsonObj.settings, 'storageKey', 'string') ||
    !hasField(jsonObj.settings, 'playGamedataName', 'string') ||
    !hasField(jsonObj.settings, 'dayInterval', 'number') ||
    !hasField(jsonObj.settings, 'unitOfDay', 'object') ||
    !hasField(jsonObj.settings.unitOfDay, 'unit', 'Array') ||
    !isArrayType(jsonObj.settings.unitOfDay.unit, 'string') ||
    !hasField(jsonObj.settings.unitOfDay, 'CycleInUnitChanges', 'number') ||
    jsonObj.settings.unitOfDay.unit.length !== 5
  ) {
    throw new InvalidJsonError('Settings class is broken');
  }
  const dayModifier = dayModifierFactory(
    jsonObj.settings.unitOfDay.unit[0],
    jsonObj.settings.unitOfDay.CycleInUnitChanges,
    jsonObj.settings.unitOfDay.unit[1],
    jsonObj.settings.unitOfDay.unit[2],
    jsonObj.settings.unitOfDay.unit[3],
    jsonObj.settings.unitOfDay.unit[4]
  );
  const settings = diarySettingsFactory(
    dayModifier,
    jsonObj.settings.playGamedataName,
    jsonObj.settings.dayInterval,
    jsonObj.settings.storageKey,
    DairySettingsConstant.CURRENT_VERSION
  );
  if (!hasField(jsonObj, 'dayDiary', 'Array')) {
    throw new InvalidJsonError('Array<DayReport> class is broken');
  }
  const map = new Map<number, IDiaryEntry>();
  for (let element of jsonObj.dayDiary) {
    if (
      !isTypeMatch(element, 'object') ||
      !hasField(element, 'day', 'number') ||
      !hasField(element, 'reportTitle', 'string') ||
      !hasField(element, 'report', 'string')
    ) {
      throw new InvalidJsonError('DayReport class is broken');
    }
    const diary = diaryEntryFactory(
      element.day,
      element.reportTitle,
      element.report,
      hasField(element, 'previous', 'number') ? element.previous : undefined,
      hasField(element, 'next', 'number') ? element.next : undefined
    );
    map.set(diary.day, diary);
  }
  return diaryFactory(map, settings, jsonObj.lastDay);
}
