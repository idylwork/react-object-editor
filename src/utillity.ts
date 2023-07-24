import { ObjectKey } from './types';

/**
 * 配列の要素置換・要素削除
 * @param array 対象配列
 * @param index 対象インデックス
 * @param replacement 指定すると置換、nullで削除
 * @returns 更新された配列
 */
export const arrayReplace = <Data>(array: Data[], index: number, replacement: Data | null = null): Data[] => {
  if ('toSpliced' in Array.prototype) {
    // @ts-ignore
    return replacement !== null ? array.toSpliced(index, 1, replacement) : array.toSpliced(index, 1);
  }
  const newArray = [...array];
  if (replacement !== null) {
    newArray.splice(index, 1, replacement);
  } else {
    newArray.splice(index, 1);
  }
  return newArray;
};

/**
 * 文字列をケバブケースに変換する
 * @param text
 * @returns
 */
export const stringToKebabCase = (text: string) => {
  return text.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (match) => `-${match.toLowerCase()}`);
};

/**
 * データを検索する
 * @param data
 * @param key
 * @returns コールバックの戻り値
 */
export const getDataItem = <Data, Value>(data: Data, key: ObjectKey, action: (target: any, lastKey: any) => Value): Value | undefined => {
  const keys = key instanceof Array ? key : [key];
  const newData = structuredClone(data);

  let result;
  let target: any = newData;
  keys.forEach((currentKey, index) => {
    /// 最後の要素なら参照先を取得
    if (index === keys.length - 1) {
      result = action(target, currentKey);
    } else {
      target = target[currentKey];
    }
  });
  return result;
};

/**
 * データの更新
 * @param data
 * @param key
 * @param action 更新するデータを返すコールバック
 * @returns 更新されたデータ
 */
export const updatedData = <Data>(data: Data, key: ObjectKey, action: (target: any) => any): Data => {
  const keys = key instanceof Array ? key : [key];
  const newData = structuredClone(data);

  let target: any = newData;
  keys.forEach((currentKey, index) => {
    /// 最後の要素なら参照先を更新
    if (index === keys.length - 1) {
      const newValue = action(target[currentKey]);
      if (newValue !== undefined) {
        target[currentKey] = newValue;
      }
    } else {
      target = target[currentKey];
    }
  });
  return newData;
};

/**
 * データの一部削除
 * @param data
 * @param key
 * @returns 要素が削除されたデータ
 */
export const removedData = <Data>(data: Data, key: ObjectKey): Data => {
  const keys = key instanceof Array ? key : [key];
  const newData = structuredClone(data);

  let target: any = newData;
  keys.forEach((currentKey, index) => {
    /// 最後の配列要素に到達したら処理を開始
    if (index === keys.length - 2) {
      const list = target[currentKey];
      const listIndex = keys.at(-1);
      if (!(list instanceof Array) || typeof listIndex !== 'number') return;

      target[currentKey] = arrayReplace(list, listIndex);
    } else {
      target = target[currentKey];
    }
  });
  return newData;
};

export const convertToTypeLabel = (type: any) => {
  switch (typeof type) {
    case 'string': return 'ABC';
    case 'number': return '123';
    case 'boolean': return '— O';
    default: return '—';
  }
};
