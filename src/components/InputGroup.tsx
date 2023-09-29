import {
  ObjectEditType, ObjectKey, TypeRule, TypeRuleGroup, InputType,
} from '../types';
import useClassName from '../useClassName';
import InputControl from './InputControl';

type Props<T> = {
  name: ObjectKey | string;
  value: T;
  typeRules: TypeRuleGroup | TypeRule;
  onChange: (actionType: ObjectEditType, key: ObjectKey, value: T) => void;
}

/**
 * 配列やオブジェクトなどの入力フォームグループ
 * @param props.name - キー名
 * @param props.value - 値
 * @param props.typeRules - 入力ルール
 * @param props.onChange - 入力時の処理
 */
const InputGroup = <T, >({
  name: nameRaw, value, typeRules, onChange,
}: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> | null => {
  /** クラス名の作成 */
  const createClassName = useClassName();
  /** 値入力時の処理 */
  const handleChange = (key: ObjectKey, newValue: T) => {
    onChange(ObjectEditType.Update, key, newValue);
  };

  /** @var nameを配列にキャスト */
  const name = nameRaw instanceof Array ? nameRaw : [nameRaw];
  /** @var グループ自体へのタイプ指定 */
  const typeRule = typeRules instanceof TypeRule ? typeRules : null;
  // 非表示の場合
  if (typeRule?.inputType === InputType.None) {
    return null;
  }

  if (!typeRule) {
    /** @var タイプルールのリスト */
    const typeRuleGroup: TypeRuleGroup = typeRules instanceof TypeRule ? {} : typeRules;

    if (value instanceof Array) {
      // 配列
      return (
        <div>
          <div className={createClassName('label')}>
            <div>{name.at(-1)}</div>
            <button type="button" className={createClassName('button')} onClick={() => onChange(ObjectEditType.Append, name, value)}>
              +
            </button>
          </div>
          <div className={createClassName('group')}>
            {value.map((nextValue, index) => {
              const typeRuleItem = typeRuleGroup[index] ?? typeRuleGroup['*'] ?? {};
              return (
                <div className={createClassName('listItem')} key={[...name, index].join('.')}>
                  <InputGroup name={[...name, index]} typeRules={typeRuleItem instanceof TypeRule ? {} : typeRuleItem} value={nextValue} onChange={onChange} />
                  <button type="button" className={createClassName('button')} onClick={() => onChange(ObjectEditType.Remove, [...name, index], value)}>
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    } if (value instanceof Object && value !== null) {
      // オブジェクト
      return (
        <div className={createClassName('control')}>
          <div className={createClassName('label')}>{name.at(-1)}</div>
          <div className={createClassName('group')}>
            {Object.entries(value).map(([nextKey, nextValue]) => (
              <InputControl key={nextKey} name={[...name, nextKey]} value={nextValue} typeRule={typeRuleGroup[nextKey] instanceof TypeRule ? typeRuleGroup[nextKey] as TypeRule : null} onChange={handleChange} />
            ))}
          </div>
        </div>
      );
    }
  }

  // タイプ指定時・最上位のプリミティブ
  return <InputControl name={name} value={value} typeRule={typeRule} onChange={handleChange} />;
};

export default InputGroup;
