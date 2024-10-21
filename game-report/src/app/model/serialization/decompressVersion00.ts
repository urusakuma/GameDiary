import { Constant } from '@/constant';
import { InvalidJsonError } from '@/error';
import { DailyReport } from '../dailyReport';
import { DailyReportBuilder } from '../dailyReportBuilder';
import { DayModifier } from '../dayModifier';
import { Reports } from '../reports';
import { Settings } from '../settings';
import { hasField, isArrayType, isTypeMatch } from '../utils/checkTypeMatch';

export function decompressVersion00(jsonObj: object): Reports {
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
  const dayModifier = new DayModifier(
    jsonObj.settings.unitOfDay.unit[0],
    jsonObj.settings.unitOfDay.CycleInUnitChanges,
    jsonObj.settings.unitOfDay.unit[1],
    jsonObj.settings.unitOfDay.unit[2],
    jsonObj.settings.unitOfDay.unit[3],
    jsonObj.settings.unitOfDay.unit[4]
  );
  const settings = new Settings(
    jsonObj.settings.storageKey,
    Constant.CURRENT_VERSION,
    jsonObj.settings.playGamedataName,
    jsonObj.settings.dayInterval,
    dayModifier
  );
  if (!hasField(jsonObj, 'dayReports', 'Array')) {
    throw new InvalidJsonError('Array<DayReport> class is broken');
  }
  const map = new Map<number, DailyReport>();
  for (let element of jsonObj.dayReports) {
    if (
      !isTypeMatch(element, 'object') ||
      !hasField(element, 'day', 'number') ||
      !hasField(element, 'reportTitle', 'string') ||
      !hasField(element, 'report', 'string')
    ) {
      throw new InvalidJsonError('DayReport class is broken');
    }
    const report = new DailyReportBuilder(
      element.day,
      element.reportTitle,
      element.report,
      hasField(element, 'previous', 'number') ? element.previous : undefined,
      hasField(element, 'next', 'number') ? element.next : undefined
    ).build();
    map.set(report.day, report);
  }
  if (!hasField(jsonObj, 'lastDay', 'number')) {
    throw new InvalidJsonError('Reports class is broken');
  }
  return new Reports(map, settings, jsonObj.lastDay);
}
