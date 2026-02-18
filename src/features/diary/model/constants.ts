const DIARY_MODEL_CONSTANTS = {
  DEFAULT_DIARY_NAME: '新しい日記',
  DEFAULT_DAY_INTERVAL: 1,
  DEFAULT_CYCLE_LENGTH: 10,
  DEFAULT_DAY_MODIFIER: '$N日目',
  PLACEHOLDERS: {
    year: '$Y',
    cycle: '$C',
    day: '$D',
    totalDay: '$N',
  },
} as const;

export default DIARY_MODEL_CONSTANTS;
