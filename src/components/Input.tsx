import { useEffect, useMemo, useState } from 'react';
import styles from './SimpleObjectEditor.module.css';

type Props<T> = { id: string, value: T, onChange: (newValue: any) => void }

/**
 * 渡された値の型に応じた入力フォーム
 * @param props.id - 入力フォームのID
 * @param props.value - 値 (プリミティブ型)
 * @param props.onChange - 値変更時の処理
 * @returns
 */
const Input = <T,>({ id, value, onChange }: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> => {
  /** 表示用の値 */
  const [editingValue, setEditingValue] = useState('');

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
    const newValue = event.currentTarget.checked;
    setEditingValue(!newValue ? 'true' : 'false');
    onChange(newValue as T);
  };

  /** 数値の最小単位 */
  const step = useMemo(() => (
    typeof value === 'number' ? (1 / 10 ** (value?.toString().split('.')[1]?.length ?? 0)) : 1
  ), [typeof value]) // eslint-disable-line react-hooks/exhaustive-deps

  switch (typeof value) {
    case 'boolean': return <>
      <input
        id={id}
        type="checkbox"
        checked={editingValue !== 'false'}
        onChange={handleToggle}
        className={`simple-object-editor-toggle-input ${styles.dummyInput}`}
      />
      <label htmlFor={id} className={`simple-object-editor-input ${styles.input} ${styles.toggleInput}`}>
        {editingValue}
      </label>
    </>
    case 'number': return <input
      id={id}
      type="number"
      value={editingValue}
      onChange={handleChange}
      step={step}
      className={`simple-object-editor-input ${styles.input}`}
    />
    case 'object': return <div className={`simple-object-editor-null ${styles.input} ${styles.null}`}>null</div>
    default: return <input
      id={id}
      type="text"
      value={editingValue}
      onChange={handleChange}
      className={`simple-object-editor-input ${styles.input}`}
    />
  }
}

export default Input;