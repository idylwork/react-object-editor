import { useMemo } from 'react';
import { TypeRule } from '../types';
import useClassName from '../useClassName';

type Props<T> = {
  id: string;
  value: T;
  typeRule: TypeRule;
  onChange: (newValue: T) => void;
  setMessage: (message: string) => void;
}

/**
 * セレクトボックスコンポーネント
 * @param props.name キー名配列
 * @param props.value デフォルト値
 * @param props.typeRule タイプ設定 (NULLで指定なし)
 * @param props.onChange 値変更時の処理
 * @returns
 */
const Select = <T, >({
  id, value: defaultValue, typeRule, onChange, setMessage,
}: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> | null => {
  /** クラス名の作成 */
  const createClassName = useClassName();
  /** 値がルール定義外か */
  const otherValue = useMemo(() => (typeRule.includes(defaultValue) ? null : `${defaultValue}`), [defaultValue, typeRule]);

  /**
   * 選択変更時の処理
   * @param event
   */
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      onChange(typeRule.find(event.currentTarget.selectedIndex) as T);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  return (
    <select id={id} defaultValue={`${defaultValue}`} className={createClassName('input')} onChange={handleChange}>
      {otherValue && <option value={otherValue}>{otherValue}</option>}
      {typeRule.values.map(([label, value]) => <option value={value} key={value}>{label}</option>)}
    </select>
  );
};

export default Select;
