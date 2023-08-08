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
  Text: 'text',
  Number: 'number',
  Select: 'select',
  None: 'none',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type InputType = typeof InputType[keyof typeof InputType];

/** 項目別入力タイプ設定 */
export type TypesProp = { [key: string]: InputType | null | string[] | { [key: string]: string } | Map<string | number, string> };

/** 入力タイプルールグループ */
// eslint-disable-next-line no-use-before-define
export type TypeRuleGroup = { [key: string]: TypeRule | TypeRuleGroup };

/** 入力タイプルール */
export class TypeRule {
  /** @property 入力タイプ */
  inputType: InputType;

  /** @property 入力値リスト */
  values: [string | number, string][];

  constructor(inputType: InputType, values: [string | number, string][] = []) {
    this.inputType = inputType;
    this.values = values;
  }

  find(index: number) {
    const value = this.values[index];
    return value ? value[0] : null;
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
              case InputType.Text:
              case InputType.Number:
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
