import { InvalidJsonError } from '@lib/error';
import {
  hasField,
  isArrayType,
  isTypeMatch,
} from '@shared/utils/checkTypeMatch';
import {
  UseExistingDataDayModifierFactory,
  IDiary,
  IDiaryEntry,
  UseExistingDataDiaryEntryFactory,
  IDiarySettingsFactory,
  IDiaryFactory,
} from '@features/diary/model/diaryModelInterfaces';

/**
 * 最初に作られたバージョンのデータをインポートするための関数。
 * settings.versionはundefined
 * @param jsonObj
 * @returns
 */
export function decompressVersion00(
  jsonObj: object,
  dayModifierFactory: UseExistingDataDayModifierFactory,
  diarySettingsFactory: IDiarySettingsFactory,
  diaryEntryFactory: UseExistingDataDiaryEntryFactory,
  diaryFactory: IDiaryFactory
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
  const settings = diarySettingsFactory.createUseExistingData(
    dayModifier,
    jsonObj.settings.playGamedataName,
    jsonObj.settings.dayInterval,
    jsonObj.settings.storageKey
  );
  if (!hasField(jsonObj, 'dayReports', 'Array')) {
    throw new InvalidJsonError('Array<DayReport> class is broken');
  }
  const map = new Map<number, IDiaryEntry>();
  for (let element of jsonObj.dayReports) {
    if (
      !isTypeMatch(element, 'Array') ||
      element.length < 1 ||
      !isTypeMatch(element[1], 'object') ||
      !hasField(element[1], 'day', 'number') ||
      !hasField(element[1], 'reportTitle', 'string') ||
      !hasField(element[1], 'report', 'string')
    ) {
      throw new InvalidJsonError('DayReport class is broken');
    }
    const diary = diaryEntryFactory(
      element[1].day,
      element[1].reportTitle,
      element[1].report,
      hasField(element[1], 'previous', 'number')
        ? element[1].previous
        : undefined,
      hasField(element[1], 'next', 'number') ? element[1].next : undefined
    );
    map.set(diary.day, diary);
  }
  return diaryFactory.createUseExistingData(map, settings, jsonObj.lastDay);
}
