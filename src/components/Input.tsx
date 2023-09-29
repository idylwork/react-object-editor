import { useEffect, useMemo, useState } from 'react';
import useClassName from '../useClassName';
import { InputType, TypeRule } from '../types';

type Props<T> = {
  id: string;
  value: T;
  typeRule: TypeRule | null;
  onChange: (newValue: T | null) => void;
}

/**
 * 渡された値の型に応じた入力フォーム
 * @param props.id - 入力フォームのID
 * @param props.value - 値 (string・number・boolean・nullのいずれか)
 * @param props.onChange - 値変更時の処理
 */
const Input = <T, >({ id, value, typeRule = null, onChange }: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> => {
  /** 表示用の値 */
  const [editingValue, setEditingValue] = useState('');
  /** クラス名の作成 */
  const createClassName = useClassName();

  /** 数値の最小単位 */
  const step = useMemo(() => (
    typeof value === 'number' ? (1 / 10 ** (value?.toString().split('.')[1]?.length ?? 0)) : 1
  ), [typeof value]); // eslint-disable-line react-hooks/exhaustive-deps

  // 値が更新されたときにフォームに反映
  useEffect(() => {
    setEditingValue(`${value}`);
  }, [value]);

  /** フォーム入力時の処理 */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setEditingValue(newValue);
    onChange((typeof value === 'number' ? parseFloat(newValue) : newValue) as T);
  };

  /** フォームチェック時の処理 */
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.currentTarget.checked;
    if (typeRule?.isOptional && newValue === true) {
      onChange(null);
      return
    }
    setEditingValue(!newValue ? 'true' : 'false');
    onChange(newValue as T);
  };

  /** NULLに変更する */
  const clearIfOptional = (event: React.FocusEvent<HTMLInputElement>) => {
    if (typeRule?.isOptional && event.currentTarget.value === '') {
      onChange(null);
    }
  };

  /** NULLクリック時にオプショナルであれば入力を復帰させる */
  const handleNullClick = () => {
    if (typeRule?.isOptional) {
      switch (typeRule.inputType) {
        case InputType.OptionalString:
        case InputType.OptionalNumber:
          onChange('' as T);
          break;
        case InputType.OptionalBoolean:
          onChange(true as T);
          break;
      }
    }
  };

  switch (typeof value) {
    case 'boolean': return (
      <>
        <input
          id={id}
          type="checkbox"
          checked={editingValue !== 'false'}
          onChange={handleToggle}
          className={createClassName('dummyInput')}
        />
        <label htmlFor={id} className={createClassName('input', 'toggleInput')}>
          {editingValue}
        </label>
      </>
    );
    case 'number': return (
      <input
        id={id}
        type="number"
        value={editingValue}
        onChange={handleChange}
        onBlur={clearIfOptional}
        step={step}
        className={createClassName('input')}
      />
    );
    case 'object': return (
      <div className={createClassName('input', 'null')} onClick={handleNullClick}>
        null
      </div>
    );
    default: return (
      <input
        id={id}
        type="text"
        value={editingValue}
        onChange={handleChange}
        onBlur={clearIfOptional}
        className={createClassName('input')}
      />
    );
  }
};

export default Input;
