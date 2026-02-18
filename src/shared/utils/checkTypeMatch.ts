export type CheckedType =
  | 'object'
  | 'string'
  | 'number'
  | 'boolean'
  | 'record'
  | 'Array';
type TypeMap = {
  object: object;
  string: string;
  number: number;
  boolean: boolean;
  record: Record<string, unknown>;
  Array: Array<unknown>;
};
/**
 * 指定したオブジェクトが指定した型のフィールドを持つか確認する。
 * @param obj 調査対象のオブジェクト
 * @param field 所持しているか確認するフィールド
 * @param type フィールドが満たすべき型
 * @returns フィールドの型が指定したとおりならtrue、その他の場合はfalse
 */
export function hasField<K extends string, T extends CheckedType>(
  obj: object,
  field: K,
  type: T
): obj is {
  [key in K]: TypeMap[T];
} {
  return (
    field in obj && // obj has field
    isTypeMatch((obj as any)[field], type) // obj.field is type of "type"
  );
}
/**
 * 指定した変数の型が指定した型か確認する。
 * @param val 調査対象の変数
 * @param type 変数が満たすべき型
 * @returns 変数の型が指定したとおりならtrue、その他の場合はfalse
 */
export function isTypeMatch<T extends CheckedType>(
  val: unknown,
  type: T
): val is TypeMap[T] {
  return (
    (typeof val === type && val !== null) || // val is type of "type"
    (type === 'Array' && val instanceof Array) || // val is Array
    (type === 'record' &&
      typeof val === 'object' &&
      val !== null &&
      !Array.isArray(val) &&
      Object.getPrototypeOf(val) === Object.prototype)
  );
}

/**
 * 配列内の全要素が指定された型かを確認する。
 * @param arr 調査対象の配列
 * @param type 配列要素が持つべき型
 * @returns すべての要素が指定された型の場合は true、それ以外の場合は false
 */
export function isArrayType<T extends CheckedType>(
  arr: Array<unknown>,
  type: T
): arr is Array<TypeMap[T]> {
  return arr.every((element) => typeof element === type);
}

/**
 * レコード内の全要素が指定された型かを確認する。
 * @param obj 調査対象のレコード
 * @param type 要素が持つべき型
 * @returns すべての要素が指定された型の場合は true、それ以外の場合は false
 */
export function isRecordType<T extends CheckedType>(
  obj: Record<string, unknown>,
  type: T
): obj is Record<string, TypeMap[T]> {
  return Object.values(obj).every((element) => typeof element === type);
}
