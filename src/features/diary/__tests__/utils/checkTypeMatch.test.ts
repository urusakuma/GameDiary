import {
  hasField,
  isArrayType,
  isRecordType,
  isTypeMatch,
} from '@shared/utils/checkTypeMatch';

type CheckedType = Parameters<typeof isTypeMatch>[1];
const types: CheckedType[] = [
  'object',
  'string',
  'number',
  'boolean',
  'record',
  'Array',
];

describe('checkTypeMatch', () => {
  describe('isTypeMatch', () => {
    class Example {}
    const cases: [string, unknown, CheckedType[]][] = [
      ['false', false, ['boolean']],
      ['zero', 0, ['number']],
      ['negative number', -1.5, ['number']],
      ['empty string', '', ['string']],
      ['string', '文字列', ['string']],
      ['plain object', {}, ['object', 'record']],
      ['Object constructor', new Object(), ['object', 'record']],
      ['array', [1, 2], ['object', 'Array']],
      ['empty array', [], ['object', 'Array']],
      ['class instance', new Example(), ['object']],
      ['Map', new Map(), ['object']],
      ['Date', new Date(0), ['object']],
      ['null prototype', Object.create(null), ['object']],
      ['null', null, []],
      ['undefined', undefined, []],
      ['function', () => undefined, []],
      ['symbol', Symbol('value'), []],
    ];

    it.each(cases)(
      'classifies %s without throwing',
      (_name, value, matches) => {
        for (const type of types) {
          expect(isTypeMatch(value, type)).toBe(matches.includes(type));
        }
      }
    );
  });

  describe('hasField', () => {
    it('checks each supported field type, including falsy values', () => {
      const value = {
        object: {},
        string: '',
        number: 0,
        boolean: false,
        record: {},
        Array: [],
      };
      for (const type of types) {
        expect(hasField(value, type, type)).toBe(true);
      }
    });

    it('rejects absent, undefined, null, and wrongly typed fields', () => {
      expect(hasField({}, 'missing', 'number')).toBe(false);
      expect(hasField({ value: undefined }, 'value', 'number')).toBe(false);
      expect(hasField({ value: null }, 'value', 'object')).toBe(false);
      expect(hasField({ value: null }, 'value', 'record')).toBe(false);
      expect(hasField({ value: '1' }, 'value', 'number')).toBe(false);
    });

    it('supports class fields and inherited fields', () => {
      class Example {
        value = 1;
      }
      expect(hasField(new Example(), 'value', 'number')).toBe(true);
      expect(hasField(Object.create({ value: 1 }), 'value', 'number')).toBe(
        true
      );
    });
  });

  const collections: [string, unknown[], CheckedType, boolean][] = [
    ['numbers', [0, 1, -2], 'number', true],
    ['strings', ['', 'a'], 'string', true],
    ['booleans', [true, false], 'boolean', true],
    ['objects', [{}, []], 'object', true],
    ['nested arrays', [[], [1]], 'Array', true],
    ['records', [{}, { a: 1 }], 'record', true],
    ['mixed types', [1, '2'], 'number', false],
    ['null object', [{}, null], 'object', false],
    ['null record', [{}, null], 'record', false],
    ['undefined', [1, undefined], 'number', false],
    ['non-array', [[], {}], 'Array', false],
    ['non-record', [{}, new Map()], 'record', false],
  ];

  describe('isArrayType', () => {
    it.each(collections)('checks %s', (_name, values, type, expected) => {
      expect(isArrayType(values, type)).toBe(expected);
    });
    it.each(types)('accepts an empty array for %s', (type) => {
      expect(isArrayType([], type)).toBe(true);
    });
  });

  describe('isRecordType', () => {
    it.each(collections)('checks %s', (_name, values, type, expected) => {
      const record = Object.fromEntries(values.map((value, i) => [i, value]));
      expect(isRecordType(record, type)).toBe(expected);
    });
    it.each(types)('accepts an empty record for %s', (type) => {
      expect(isRecordType({}, type)).toBe(true);
    });
  });
});
