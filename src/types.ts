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

/** 入力タイプルール種別 */
export const InputType = {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  Select: 'select',
  OptionalString: 'string?',
  OptionalNumber: 'number?',
  OptionalBoolean: 'boolean?',
  None: 'none',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type InputType = typeof InputType[keyof typeof InputType];

/** 項目別入力タイプ設定 */
export type TypesProp = { [key: string]: string | InputType | null | string[] | { [key: string]: string | number } | Map<string, string | number> };

/** 入力タイプルールグループ */
// eslint-disable-next-line no-use-before-define
export type TypeRuleGroup = { [key: string]: TypeRule | TypeRuleGroup };

/** 入力タイプルール */
export class TypeRule {
  /** @property 入力タイプ */
  inputType: InputType;

  /** @property 入力値リスト */
  values: [string, string | number][];

  constructor(inputType: InputType, values: [string, string | number][] = []) {
    this.inputType = inputType;
    this.values = values;
  }

  /** NULL許可の項目か */
  get isOptional() {
    switch (this.inputType) {
      case InputType.OptionalString:
      case InputType.OptionalNumber:
      case InputType.OptionalBoolean:
        return true;
      default:
        return false;
    }
  }

  /**
   * 入力値リストに値が含まれるか
   * @param value 検索対象の値
   * @returns
   */
  includes(value: any) {
    return this.values.some(([, target]) => target === value)
  }

  /**
   * インデックスから値を取得する
   * @param index
   * @returns
   */
  find(index: number) {
    const value = this.values[index];
    return value ? value[1] : null;
  }

  /**
   * 値を入力タイプに沿うように変換する
   * @param value
   * @returns
   */
  cast(value: any) {
    switch (this.inputType) {
      case InputType.String:
        return typeof value === 'string' ? value : `${value}`;
      case InputType.Number:
        return typeof value === 'number' ? value : parseFloat(`${value}`);
      case InputType.Boolean:
        return typeof value === 'boolean' ? value : !!value;
      case InputType.OptionalString:
        if (value === null) return null;
        return typeof value === 'string' ? value : `${value}`;
      case InputType.OptionalNumber:
        if (value === null) return null;
        return typeof value === 'number' ? value : parseFloat(`${value}`);
      case InputType.OptionalBoolean:
        if (value === null) return null;
        return typeof value === 'boolean' ? value : !!value;
      default:
        return value;
    }
  }

  /**
   * types設定をオブジェクトにパース
   * @param types types設定 e.g. {'links.*.target': ['normal', '_target']}
   * @returns タイプルール
   */
  static parse(types: TypesProp): TypeRuleGroup {
    const rules: TypeRuleGroup = {};
    Object.entries(types).forEach(([typeKey, rule]) => {
      let target = rules;

      const keys = typeKey.split('.');
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          if (rule === null) {
            target[key] = new TypeRule(InputType.None);
          } else if (rule instanceof Array) {
            target[key] = new TypeRule(InputType.Select, rule.map((item) => [item, item]));
          } else if (rule instanceof Map) {
            target[key] = new TypeRule(InputType.Select, [...rule]);
          } else if (rule instanceof Object) {
            target[key] = new TypeRule(InputType.Select, Object.entries(rule));
          } else {
            switch (rule) {
              case InputType.String:
              case InputType.Number:
              case InputType.Boolean:
              case InputType.OptionalString:
              case InputType.OptionalNumber:
              case InputType.OptionalBoolean:
                target[key] = new TypeRule(rule);
                break;
              default:
            }
          }
        } else {
          if (!target || !(target[key] instanceof Object)) {
            target[key] = {};
          }
          target = target[key] as TypeRuleGroup;
        }
      });
    });
    return rules;
  }
}

/** ネストされたデータを指定するためのキーリスト */
export type ObjectKey = (string | number)[];
