/** オブジェクトやデータに格納可能な型 */
export type PrimitiveType = string | number | boolean | null

/** データとして扱う型 */
export interface ObjectData { [key: string]: PrimitiveType | PrimitiveType[] | ObjectData | ObjectData[] }

/** オブジェクト編集アクションのタイプ */
export const ObjectEditType = {
  Update: 'Update',
  Append: 'Append',
  Remove: 'Remove',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ObjectEditType = typeof ObjectEditType[keyof typeof ObjectEditType];

/** ネストされたデータを指定するためのキーリスト */
export type ObjectKey = string | (string | number)[];
