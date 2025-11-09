import type {
  IDiarySettingsFactory,
  IDayModifier,
  IDiarySettings,
  UseExistingDataDayModifierFactory,
  DefaultSettingsFactory,
  StorageKeyFactory,
} from './diaryModelInterfaces';
import DiarySettings from './diarySettings';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class DiarySettingsFactory implements IDiarySettingsFactory {
  constructor(
    @inject('DefaultSettingsFactory')
    private defaultSettingsFactory: DefaultSettingsFactory,
    @inject('UseExistingDataDayModifierFactory')
    private modifierFactory: UseExistingDataDayModifierFactory,
    @inject('StorageKeyFactory') private StorageKeyFactory: StorageKeyFactory,
    @inject('VERSION') private version: number
  ) {}

  createUseExistingData(
    dayModifier: IDayModifier,
    diaryName: string,
    dayInterval: number,
    storageKey: string
  ): IDiarySettings {
    return new DiarySettings(
      dayModifier,
      diaryName,
      dayInterval,
      storageKey,
      this.version
    );
  }

  createNewDiarySettings(
    settings?: IDiarySettings,
    name?: string
  ): IDiarySettings {
    if (settings === undefined) {
      settings = this.defaultSettingsFactory();
    }
    const modifierUnits = new Array<string>(4);
    for (let i = 0; i < modifierUnits.length; i++) {
      modifierUnits[i] = settings.getModifierUnit(i);
    }
    const newModifier = this.modifierFactory(
      settings.getModifier(),
      settings.getCycleLength(),
      ...modifierUnits
    );
    const interval = settings.getDayInterval();
    const storageKey = this.StorageKeyFactory();
    return new DiarySettings(
      newModifier,
      name ?? settings.getDiaryName(),
      interval,
      storageKey,
      this.version
    );
  }
}
