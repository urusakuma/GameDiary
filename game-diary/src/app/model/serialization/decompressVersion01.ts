import { Constant } from '@/constant';
import { InvalidJsonError } from '@/error';
import { hasField, isArrayType, isTypeMatch } from '../utils/checkTypeMatch';
import {
  DayModifierFactory,
  DiaryFactory,
  DiarySettingsFactory,
  IDiary,
  IDiaryEntry,
  UseExistingDataDiaryEntryFactory,
} from '../diary/diaryModelInterfaces';

export function decompressVersion01(
  jsonObj: object,
  dayModifierFactory: DayModifierFactory,
  diarySettingsFactory: DiarySettingsFactory,
  diaryEntryFactory: UseExistingDataDiaryEntryFactory,
  diaryFactory: DiaryFactory
): IDiary {
  if (!hasField(jsonObj, 'lastDay', 'number')) {
    throw new InvalidJsonError('Reports class is broken');
  }
  if (
    !hasField(jsonObj, 'settings', 'object') ||
    !hasField(jsonObj.settings, '_storageKey', 'string') ||
    !hasField(jsonObj.settings, 'playGameDataName', 'string') ||
    !hasField(jsonObj.settings, 'dayInterval', 'number') ||
    !hasField(jsonObj.settings, 'dayModifier', 'object')
  ) {
    throw new InvalidJsonError('Settings class is broken');
  }
  if (
    !hasField(jsonObj.settings.dayModifier, 'modifier', 'string') ||
    !hasField(jsonObj.settings.dayModifier, 'cycleLength', 'number') ||
    !hasField(jsonObj.settings.dayModifier, 'unit', 'Array') ||
    !isArrayType(jsonObj.settings.dayModifier.unit, 'string') ||
    jsonObj.settings.dayModifier.unit.length <= 4
  ) {
    throw new InvalidJsonError('DayModifier class is broken');
  }
  const dayModifier = dayModifierFactory(
    jsonObj.settings.dayModifier.modifier,
    jsonObj.settings.dayModifier.cycleLength,
    ...jsonObj.settings.dayModifier.unit
  );
  const settings = diarySettingsFactory(
    dayModifier,
    jsonObj.settings.playGameDataName,
    jsonObj.settings.dayInterval,
    jsonObj.settings._storageKey,
    Constant.CURRENT_VERSION
  );
  if (!hasField(jsonObj, 'diaryEntries', 'Array')) {
    throw new InvalidJsonError('Array<DayReport> class is broken');
  }
  if (
    !jsonObj.diaryEntries.every(
      (v) =>
        isTypeMatch(v, 'object') &&
        hasField(v, 'day', 'number') &&
        hasField(v, 'title', 'string') &&
        hasField(v, 'content', 'string')
    )
  ) {
    throw new InvalidJsonError('DayReport class is broken');
  }
  const map = new Map<number, IDiaryEntry>();
  const previousMap = new Map<number, number | undefined>();
  for (let element of jsonObj.diaryEntries) {
    // 翌日が存在するなら翌日のdayから前日のdayを参照できるようにしておく。
    if (hasField(element, 'next', 'number')) {
      previousMap.set(element.next, element.day);
    }
    const diary: IDiaryEntry = diaryEntryFactory(
      element.day,
      element.title,
      element.content,
      previousMap.get(element.day),
      hasField(element, 'next', 'number') ? element.next : undefined
    );
    map.set(diary.day, diary);
  }
  return diaryFactory(map, settings, jsonObj.lastDay);
}
