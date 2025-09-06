import { container } from 'tsyringe';
import {
  IDiary,
  IDiaryFactory,
  IDiaryEntry,
  IDiaryEntryFactory,
  NewDiaryEntriesFactory,
  UsePreviousDayDiaryEntryFactory,
  UseExistingDataDiaryEntryFactory,
  StorageKeyFactory,
  IDiarySettings,
  IDiarySettingsFactory,
  DefaultSettingsFactory,
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
  IDiaryDelete,
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
  IDiaryNameService,
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
import {
  CompressDiary,
  IDiaryDecompressor,
} from '@/model/serialization/serializationInterface';
import {
  compressDiary,
  DiaryDecompressor,
} from '@/model/serialization/diarySerializer';
import DiaryNameService from '@/control/controlDiary/diaryNameService';
import DiaryDelete from '@/model/repository/diaryDelete';

// diaryModelInterfaces
container.register<UsePreviousDayDiaryEntryFactory>(
  'UsePreviousDayDiaryEntryFactory',
  {
    useFactory: (c) =>
      c.resolve<IDiaryEntryFactory>('IDiaryEntryFactory').createUsePreviousDay,
  }
);

container.register<Map<number, IDiaryEntry>>(
  'DIARY_ENTRIES_CONTAINING_FIRST_DAY',
  {
    useFactory: (c) => {
      const firstEntry = c.resolve<IDiaryEntry>('IDiaryEntry');
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
    useFactory: (c) =>
      c.resolve<IDiaryEntryFactory>('IDiaryEntryFactory').createUseExistingData,
  }
);
container.register<StorageKeyFactory>('StorageKeyFactory', {
  useFactory: (c) => () => c.resolve<string>('STORAGE_KEY'),
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
  useFactory: (c) => () => c.resolve<IDiarySettings>('IDiarySettings'),
});

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
container.registerSingleton<IStorageService>(
  'IStorageService',
  LocalStorageService
);
container.register<IsStorageAvailableFunc>('IsStorageAvailableFunc', {
  useValue: isStorageAvailable,
});

// diaryRepositoryInterfaces
container.registerSingleton<IDiaryService>('IDiaryService', DiaryService);
container.registerSingleton<IDiaryNameManager>(
  'IDiaryNameManager',
  DiaryNameManager
);
container.registerSingleton<IDiaryDataMigrator>(
  'IDiaryDataMigrator',
  DiaryDataMigrator
);
container.registerSingleton<IUniqueDiaryNameGenerator>(
  'IUniqueDiaryNameGenerator',
  UniqueDiaryNameGenerator
);
container.registerSingleton<ICurrentDiaryManager>(
  'ICurrentDiaryManager',
  CurrentDiaryManager
);
container.registerSingleton<IDiaryImport>('IDiaryImport', DiaryImport);
container.registerSingleton<IDiaryExport>('IDiaryExport', DiaryExport);
container.registerSingleton<IDiarySave>('IDiarySave', DiarySave);
container.registerSingleton<IDiaryLoad>('IDiaryLoad', DiaryLoad);
container.registerSingleton<IDiaryDelete>('IDiaryDelete', DiaryDelete);

// controlDiaryInterfaces
container.registerSingleton<ICurrentDiaryAccessor>(
  'ICurrentDiaryAccessor',
  CurrentDiaryAccessor
);
container.registerSingleton<IDiaryNameService>(
  'IDiaryNameService',
  DiaryNameService
);
container.registerSingleton<ICreateDiary>('ICreateDiary', CreateDiary);
container.registerSingleton<IDeleteDiary>('IDeleteDiary', DeleteDiary);
container.registerSingleton<IDiaryImporter>('IDiaryImporter', DiaryImporter);
container.registerSingleton<IDiaryExporter>('IDiaryExporter', DiaryExporter);
container.registerSingleton<IDiarySaveHandler>(
  'IDiarySaveHandler',
  DiarySaveHandler
);
container.registerSingleton<IDiaryLoadHandler>(
  'IDiaryLoadHandler',
  DiaryLoadHandler
);

// controlDiaryEntryInterfaces
container.registerSingleton<ICurrentDiaryEntryAccessor>(
  'ICurrentDiaryEntryAccessor',
  CurrentDiaryEntryAccessor
);
container.registerSingleton<IChangeCurrentDiaryEntry>(
  'IChangeCurrentDiaryEntry',
  ChangeCurrentDiaryEntry
);
container.registerSingleton<IDeleteDiaryEntry>(
  'IDeleteDiaryEntry',
  DeleteDiaryEntry
);
container.registerSingleton<IEditDiarySettings>(
  'IEditDiarySettings',
  EditDiarySettings
);
container.registerSingleton<IEditDiaryEntry>('IEditDiaryEntry', EditDiaryEntry);

// serializationInterface
container.register<CompressDiary>('CompressDiary', { useValue: compressDiary });
container.register<IDiaryDecompressor>('IDiaryDecompressor', {
  useClass: DiaryDecompressor,
});
