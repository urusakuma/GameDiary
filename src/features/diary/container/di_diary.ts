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
  Placeholders,
} from '@features/diary/model/diaryModelInterfaces';
import DIARY_MODEL_CONSTANTS from '@features/diary/model/constants';
import { IStorageService } from '@features/diary/services/persistence/storageServiceInterface';
import {
  ICurrentDiaryManager,
  IDiaryDataMigrator,
  IDiaryExport,
  IDiaryImport,
  IDiaryLoad,
  IDiaryNameManager,
  IDiarySave,
} from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import { IDiaryService } from '@features/diary/services/repository/diaryRepositoryInterfaces';
import { IUniqueDiaryNameGenerator } from '@features/diary/services/domain/diaryDomainServiceInterfaces';
import DIARY_CONSTANTS from '@features/diary/constants';
import DiaryEntry from '@features/diary/model/diaryEntry';
import Diary from '@features/diary/model/diary';
import DayModifier from '@features/diary/model/dayModifier';
import DiarySettings from '@features/diary/model/diarySettings';
import StorageService from '@features/diary/services/persistence/storageService';
import DiaryFactory from '@features/diary/model/factories/diaryFactory';
import DiaryEntryFactory from '@features/diary/model/factories/diaryEntryFactory';
import DiarySettingsFactory from '@features/diary/model/factories/diarySettingsFactory';
import DiaryService from '@features/diary/services/repository/diaryService';
import DiaryNameManager from '@features/diary/services/persistence/diaryNameManager';
import DiaryDataMigrator from '@features/diary/services/persistence/diaryDataMigrator';
import UniqueDiaryNameGenerator from '@features/diary/services/domain/uniqueDiaryNameGenerator';
import CurrentDiaryManager from '@features/diary/services/persistence/currentDiaryManager';
import DiaryImport from '@features/diary/services/persistence/diaryImport';
import DiaryExport from '@features/diary/services/persistence/diaryExport';
import DiarySave from '@features/diary/services/persistence/diarySave';
import DiaryLoad from '@features/diary/services/persistence/diaryLoad';
import {
  ICreateDiary,
  ICurrentDiaryAccessor,
  IEditDiarySettings,
  IDeleteDiary,
  IDiaryExporter,
  IDiaryImporter,
  IDiaryLoadHandler,
  IDiaryNameService,
  IDiarySaveHandler,
} from '@features/diary/control/diary/controlDiaryInterface';
import CurrentDiaryAccessor from '@features/diary/control/diary/accessors/currentDiaryAccessor';
import DiaryNameService from '@features/diary/control/diary/accessors/diaryNameService';
import CreateDiary from '@features/diary/control/diary/useCases/createDiary';
import DeleteDiary from '@features/diary/control/diary/useCases/deleteDiary';
import DiaryImporter from '@features/diary/control/diary/useCases/diaryImporter';
import DiaryExporter from '@features/diary/control/diary/useCases/diaryExporter';
import DiaryLoadHandler from '@features/diary/control/diary/useCases/diaryLoadHandler';
import DiarySaveHandler from '@features/diary/control/diary/useCases/diarySaveHandler';
import EditDiarySettings from '@features/diary/control/diary/useCases/editDiarySettings';
import {
  ICurrentDiaryEntryAccessor,
  IChangeCurrentDiaryEntry,
  IDeleteDiaryEntry,
  IEditDiaryEntry,
} from '@features/diary/control/diaryEntry/controlDiaryEntryInterface';
import CurrentDiaryEntryAccessor from '@features/diary/control/diaryEntry/accessors/currentDiaryEntryAccessor';
import ChangeCurrentDiaryEntry from '@features/diary/control/diaryEntry/useCases/changeCurrentDiaryEntry';
import DeleteDiaryEntry from '@features/diary/control/diaryEntry/useCases/deleteDiaryEntry';
import EditDiaryEntry from '@features/diary/control/diaryEntry/useCases/editDiaryEntry';
import {
  CompressDiary,
  IDiaryDecompressor,
} from '@features/diary/services/serialization/serializationInterface';
import {
  compressDiary,
  DiaryDecompressor,
} from '@features/diary/services/serialization/diarySerializer';

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
    DIARY_MODEL_CONSTANTS.DEFAULT_DAY_MODIFIER,
});
container.register<string>('HOW_TO_USE_TEXT_URL', {
  useValue: DIARY_CONSTANTS.HOW_TO_USE_TEXT_URL,
});
container.register<string>('HOW_TO_USE_KEY', {
  useValue: DIARY_CONSTANTS.HOW_TO_USE_KEY,
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
  useValue: DIARY_MODEL_CONSTANTS.DEFAULT_DIARY_NAME,
});
container.register<number>('DAY_INTERVAL', {
  useValue: DIARY_MODEL_CONSTANTS.DEFAULT_DAY_INTERVAL,
});
container.register<string>('STORAGE_KEY', {
  useFactory: () => crypto.randomUUID(),
});
container.register<number>('VERSION', {
  useValue: DIARY_CONSTANTS.CURRENT_VERSION,
});
container.register<IDiarySettingsFactory>('IDiarySettingsFactory', {
  useClass: DiarySettingsFactory,
});
container.register<DefaultSettingsFactory>('DefaultSettingsFactory', {
  useFactory: (c) => () => c.resolve<IDiarySettings>('IDiarySettings'),
});

container.register<Placeholders>('Placeholders', {
  useValue: DIARY_MODEL_CONSTANTS.PLACEHOLDERS,
});

container.register<IDayModifier>('IDayModifier', {
  useClass: DayModifier,
});

container.register<string>('DAY_MODIFIER', {
  useValue: DIARY_MODEL_CONSTANTS.DEFAULT_DAY_MODIFIER,
});
container.register<number>('CYCLE_LENGTH', {
  useValue: DIARY_MODEL_CONSTANTS.DEFAULT_CYCLE_LENGTH,
});

container.register<UseExistingDataDayModifierFactory>(
  'UseExistingDataDayModifierFactory',
  {
    useFactory:
      (c) =>
      (modifier: string, cycleLength: number, ...unit: Array<string>) =>
        new DayModifier(
          modifier,
          cycleLength,
          c.resolve<Placeholders>('Placeholders'),
          ...unit
        ),
  }
);

// storageServiceInterfaces
container.registerSingleton<IStorageService>('IStorageService', StorageService);

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
