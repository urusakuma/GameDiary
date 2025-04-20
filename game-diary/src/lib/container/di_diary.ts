import { container } from 'tsyringe';
import {
  IDiary,
  IDiaryFactory,
  UseExistingDataDiaryFactory,
  IDiaryEntry,
  IDiaryEntryFactory,
  NewDiaryEntriesFactory,
  UsePreviousDayDiaryEntryFactory,
  UseExistingDataDiaryEntryFactory,
  StorageKeyFactory,
  IDiarySettings,
  IDiarySettingsFactory,
  DefaultSettingsFactory,
  NewDiarySettingsFactory,
  UseExistingDataDiarySettingsFactory,
  IDayModifier,
  UseExistingDataDayModifierFactory,
} from '@/model/diary/diaryModelInterfaces';
import {
  IsStorageAvailableFunc,
  IStorageService,
} from '@/model/utils/storageServiceInterface';
import {
  ICurrentDiaryManager,
  IDiaryDataMigrator,
  IDiaryExport,
  IDiaryImport,
  IDiaryLoad,
  IDiaryNameManager,
  IDiarySave,
  IDiaryService,
  IUniqueDiaryNameGenerator,
} from '@/model/repository/diaryRepositoryInterfaces';
import DiaryEntry from '@/model/diary/diaryEntry';
import Diary from '@/model/diary/diary';
import DairySettingsConstant from '@/dairySettingsConstant';
import DayModifier from '@/model/diary/dayModifier';
import DiarySettings from '@/model/diary/diarySettings';
import {
  isStorageAvailable,
  LocalStorageService,
} from '@/model/utils/storageService';
import DiaryFactory from '@/model/repository/diaryFactory';
import DiaryEntryFactory from '@/model/diary/diaryEntryFactory';
import DiarySettingsFactory from '@/model/diary/diarySettingsFactory';
import DiaryService from '@/model/repository/diaryService';
import DiaryNameManager from '@/model/repository/diaryNameManager';
import DiaryDataMigrator from '@/model/repository/diaryDataMigrator';
import UniqueDiaryNameGenerator from '@/model/repository/uniqueDiaryNameGenerator';
import CurrentDiaryManager from '@/model/repository/currentDiaryManager';
import DiaryImport from '@/model/repository/diaryImport';
import DiaryExport from '@/model/repository/diaryExport';
import DiarySave from '@/model/repository/diarySave';
import DiaryLoad from '@/model/repository/diaryLoad';
import {
  ICreateDiary,
  ICurrentDiaryAccessor,
  IDeleteDiary,
  IDiaryExporter,
  IDiaryImporter,
  IDiaryLoadHandler,
  IDiarySaveHandler,
} from '@/control/controlDiary/controlDiaryInterface';
import CurrentDiaryAccessor from '@/control/controlDiary/currentDiaryAccessor';
import CreateDiary from '@/control/controlDiary/createDiary';
import DeleteDiary from '@/control/controlDiary/deleteDiary';
import DiaryImporter from '@/control/controlDiary/diaryImporter';
import DiaryExporter from '@/control/controlDiary/diaryExporter';
import DiaryLoadHandler from '@/control/controlDiary/diaryLoadHandler';
import DiarySaveHandler from '@/control/controlDiary/diarySaveHandler';
import EditDiarySettings from '@/control/controlDiary/editDiarySettings';
import ChangeCurrentDiaryEntry from '@/control/controlDiaryEntry/changeCurrentDiaryEntry';
import {
  ICurrentDiaryEntryAccessor,
  IChangeCurrentDiaryEntry,
  IDeleteDiaryEntry,
  IEditDiarySettings,
  IEditDiaryEntry,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import CurrentDiaryEntryAccessor from '@/control/controlDiaryEntry/currentDiaryEntryAccessor';
import DeleteDiaryEntry from '@/control/controlDiaryEntry/deleteDiaryEntry';
import EditDiaryEntry from '@/control/controlDiaryEntry/editDiaryEntry';

// diaryModelInterfaces
container.register<UsePreviousDayDiaryEntryFactory>(
  'UsePreviousDayDiaryEntryFactory',
  {
    useFactory: () =>
      container.resolve<IDiaryEntryFactory>('IDiaryEntryFactory')
        .createUsePreviousDay,
  }
);

container.register<Map<number, IDiaryEntry>>(
  'DIARY_ENTRIES_CONTAINING_FIRST_DAY',
  {
    useFactory: () => {
      const firstEntry = container.resolve<IDiaryEntry>('IDiaryEntry');
      return new Map<number, IDiaryEntry>().set(1, firstEntry);
    },
  }
);

container.register<NewDiaryEntriesFactory>('NewDiaryEntriesFactory', {
  useFactory: () => () =>
    container.resolve<Map<number, IDiaryEntry>>(
      'DIARY_ENTRIES_CONTAINING_FIRST_DAY'
    ),
});
container.register<IDiary>('IDiary', { useClass: Diary });
container.register<IDiaryFactory>('IDiaryFactory', { useClass: DiaryFactory });
container.register<UseExistingDataDiaryFactory>('UseExistingDataDiaryFactory', {
  useFactory: () =>
    container.resolve<IDiaryFactory>('IDiaryFactory').createUseExistingData,
});
container.register<IDiaryEntry>('IDiaryEntry', {
  useClass: DiaryEntry,
});
container.register<number>('FIRST_DAY', {
  useValue: 1,
});
container.register<string>('DEFAULT_TITLE', {
  useValue:
    String(container.resolve<number>('FIRST_DAY')) +
    DairySettingsConstant.DEFAULT_DAY_MODIFIER,
});
container.register<string>('EMPTY_STRING', { useValue: '' });
container.register<undefined>('UNDEFINED', { useFactory: () => undefined });

container.register<IDiaryEntryFactory>('IDiaryEntryFactory', {
  useClass: DiaryEntryFactory,
});

container.register<UseExistingDataDiaryEntryFactory>(
  'UseExistingDataDiaryEntryFactory',
  {
    useFactory: () =>
      container.resolve<IDiaryEntryFactory>('IDiaryEntryFactory')
        .createUseExistingData,
  }
);
container.register<StorageKeyFactory>('StorageKeyFactory', {
  useFactory: () => () => container.resolve<string>('STORAGE_KEY'),
});

container.register<IDiarySettings>('IDiarySettings', {
  useClass: DiarySettings,
});
container.register<string>('DIARY_NAME', {
  useValue: DairySettingsConstant.DEFAULT_DIARY_NAME,
});
container.register<number>('DAY_INTERVAL', {
  useValue: DairySettingsConstant.DEFAULT_DAY_INTERVAL,
});
container.register<string>('STORAGE_KEY', {
  useFactory: () => crypto.randomUUID(),
});
container.register<number>('VERSION', {
  useValue: DairySettingsConstant.CURRENT_VERSION,
});
container.register<IDiarySettingsFactory>('IDiarySettingsFactory', {
  useClass: DiarySettingsFactory,
});
container.register<DefaultSettingsFactory>('DefaultSettingsFactory', {
  useFactory: () => () => container.resolve<IDiarySettings>('IDiarySettings'),
});
container.register<NewDiarySettingsFactory>('NewDiarySettingsFactory', {
  useFactory: () =>
    container.resolve<IDiarySettingsFactory>('IDiarySettingsFactory')
      .createNewDiarySettings,
});
container.register<UseExistingDataDiarySettingsFactory>(
  'UseExistingDataDiarySettingsFactory',
  {
    useFactory: () =>
      container.resolve<IDiarySettingsFactory>('IDiarySettingsFactory')
        .createUseExistingData,
  }
);

container.register<IDayModifier>('IDayModifier', {
  useClass: DayModifier,
});

container.register<string>('DAY_MODIFIER', {
  useValue: DairySettingsConstant.DEFAULT_DAY_MODIFIER,
});
container.register<number>('CYCLE_LENGTH', {
  useValue: DairySettingsConstant.DEFAULT_CYCLE_LENGTH,
});

container.register<UseExistingDataDayModifierFactory>(
  'UseExistingDataDayModifierFactory',
  {
    useFactory:
      () =>
      (modifier: string, cycleLength: number, ...unit: Array<string>) =>
        new DayModifier(modifier, cycleLength, ...unit),
  }
);
// storageServiceInterfaces
container.register<IStorageService>('IDiaryService', {
  useClass: LocalStorageService,
});
container.register<IsStorageAvailableFunc>('IsStorageAvailableFunc', {
  useFactory: () => isStorageAvailable,
});
// diaryRepositoryInterfaces
container.register<IDiaryService>('IDiaryService', {
  useClass: DiaryService,
});
container.register<IDiaryNameManager>('IDiaryNameManager', {
  useClass: DiaryNameManager,
});
container.register<IDiaryDataMigrator>('IDiaryDataMigrator', {
  useClass: DiaryDataMigrator,
});
container.register<IUniqueDiaryNameGenerator>('IUniqueDiaryNameGenerator', {
  useClass: UniqueDiaryNameGenerator,
});
container.register<ICurrentDiaryManager>('ICurrentDiaryManager', {
  useClass: CurrentDiaryManager,
});
container.register<IDiaryImport>('IDiaryImport', {
  useClass: DiaryImport,
});

container.register<IDiaryExport>('IDiaryExport', {
  useClass: DiaryExport,
});
container.register<IDiarySave>('IDiarySave', {
  useClass: DiarySave,
});
container.register<IDiaryLoad>('IDiaryLoad', {
  useClass: DiaryLoad,
});
// controlDiaryInterfaces
container.register<ICurrentDiaryAccessor>('ICurrentDiaryAccessor', {
  useClass: CurrentDiaryAccessor,
});
container.register<ICreateDiary>('ICreateDiary', {
  useClass: CreateDiary,
});
container.register<IDeleteDiary>('IDeleteDiary', {
  useClass: DeleteDiary,
});
container.register<IDiaryImporter>('IDiaryImporter', {
  useClass: DiaryImporter,
});

container.register<IDiaryExporter>('IDiaryExporter', {
  useClass: DiaryExporter,
});

container.register<IDiarySaveHandler>('IDiarySaveHandler', {
  useClass: DiarySaveHandler,
});

container.register<IDiaryLoadHandler>('IDiaryLoadHandler', {
  useClass: DiaryLoadHandler,
});

// controlDiaryEntryInterfaces
container.register<ICurrentDiaryEntryAccessor>('ICurrentDiaryEntryAccessor', {
  useClass: CurrentDiaryEntryAccessor,
});
container.register<IChangeCurrentDiaryEntry>('IChangeCurrentDiaryEntry', {
  useClass: ChangeCurrentDiaryEntry,
});
container.register<IDeleteDiaryEntry>('IDeleteDiaryEntry', {
  useClass: DeleteDiaryEntry,
});

container.register<IEditDiarySettings>('IEditDiarySettings', {
  useClass: EditDiarySettings,
});

container.register<IEditDiaryEntry>('IEditDiaryEntry', {
  useClass: EditDiaryEntry,
});

/******************************************
 *                                        *
 *                未整理                  *
 *                                        *
 ******************************************/
