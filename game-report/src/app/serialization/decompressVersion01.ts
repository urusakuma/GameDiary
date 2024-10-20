import { Constant } from '../constant';
import { InvalidJsonError } from '../error';
import { DailyReport } from '../model/dailyReport';
import { DailyReportBuilder } from '../model/dailyReportBuilder';
import { DayModifier } from '../model/dayModifier';
import { Reports } from '../model/reports';
import { Settings } from '../model/settings';
import { hasField, isArrayType, isTypeMatch } from '../utils/checkTypeMatch';

export function decompressVersion01(jsonObj: object): Reports {
  if (
    !hasField(jsonObj, 'settings', 'object') ||
    !hasField(jsonObj.settings, '_storageKey', 'string') ||
    !hasField(jsonObj.settings, '_playGamedataName', 'string') ||
    !hasField(jsonObj.settings, '_dayInterval', 'number') ||
    !hasField(jsonObj.settings, 'dayModifier', 'object') ||
    !hasField(jsonObj.settings.dayModifier, '_modifier', 'string') ||
    !hasField(jsonObj.settings.dayModifier, '_cycleLength', 'number') ||
    !hasField(jsonObj.settings.dayModifier, '_unit', 'Array') ||
    !isArrayType(jsonObj.settings.dayModifier._unit, 'string') ||
    jsonObj.settings.dayModifier._unit.length <= 4
  ) {
    throw new InvalidJsonError('Settings class is broken');
  }
  const dayModifier = new DayModifier(
    jsonObj.settings.dayModifier._modifier,
    jsonObj.settings.dayModifier._cycleLength,
    ...jsonObj.settings.dayModifier._unit
  );
  const settings = new Settings(
    jsonObj.settings._storageKey,
    Constant.CURRENT_VERSION,
    jsonObj.settings._playGamedataName,
    jsonObj.settings._dayInterval,
    dayModifier
  );
  if (!hasField(jsonObj, 'dailyReports', 'Array')) {
    throw new InvalidJsonError('Array<DayReport> class is broken');
  }
  const map = new Map<number, DailyReport>();
  const previousMap = new Map<number, number | undefined>();
  for (let element of jsonObj.dailyReports) {
    if (
      !isTypeMatch(element, 'object') ||
      !hasField(element, 'day', 'number') ||
      !hasField(element, 'reportTitle', 'string') ||
      !hasField(element, 'report', 'string')
    ) {
      throw new InvalidJsonError('DayReport class is broken');
    }
    // 翌日が存在するなら翌日のdayから前日のdayを参照できるようにしておく。
    if (hasField(element, 'next', 'number')) {
      previousMap.set(element.next, element.day);
    }
    const report = new DailyReportBuilder(
      element.day,
      element.reportTitle,
      element.report,
      previousMap.get(element.day),
      hasField(element, 'next', 'number') ? element.next : undefined
    ).build();
    map.set(report.day, report);
  }
  if (!hasField(jsonObj, 'lastDay', 'number')) {
    throw new InvalidJsonError('Reports class is broken');
  }
  return new Reports(map, settings, jsonObj.lastDay);
}
