import { useId, useRef, useState } from 'react';
import { ObjectKey } from '../types';
import styles from './SimpleObjectEditor.module.css';
import Input from './Input';
import { convertToTypeLabel } from '../utillity';

type Props<T> = { name: ObjectKey, value: T; onChange: (key: ObjectKey, value: T) => void; }

/** 入力フォーム項目コンポーネント */
const InputControl = <T,>({ name, value: defaultValue, onChange }: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> => {
  /** 自由入力編集中用の値 */
  const [editingJson, setEditingJson] = useState('');
  /** エラーメッセージ */
  const [message, setMessage] = useState('');
  /** JSONの行として編集中の値 (NULLで未編集) */
  const [isFreeInputEnabled, setIsFreeInputEnabled] = useState(false);
  /** フォームのID */
  const id = useId();
  /** 入力フォームの参照 */
  const inputRef = useRef<HTMLInputElement>(null);

  /** フォーム入力時の処理 */
  const handleChange = (newValue: T) => {
    if (!isFreeInputEnabled) {
      setMessage('');
      try {
        onChange(name, newValue as T);
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        }
      }
    }
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingJson(event.currentTarget.value);
  };

  const startJsonMode = () => {
    let text = '';

    switch (typeof defaultValue) {
      case 'string': text = `"${defaultValue}"`; break;
      default: text = `${defaultValue}`; break;
    }

    setIsFreeInputEnabled(true);
    setEditingJson(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const endJsonMode = () => {
    setEditingJson('');
    setIsFreeInputEnabled(false);

    let newValue = null;
    try {
      const parsedData = JSON.parse(`{ "item": ${editingJson} }`);
      newValue = parsedData.item;
      setMessage('');
    } catch (error) {
      // 書式が合わないときは編集の反映をキャンセルする
      setMessage('値の書式が正しくありません。');
      return;
    }

    onChange(name, newValue);
  };

  /**
   * エンターキーを無効化する
   * @param event
   */
  const preventEnterKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      endJsonMode();
    }
  };

  return isFreeInputEnabled ? (
    <div className={`simple-object-editor-control ${styles.control}`}>
      <label className={`simple-object-editor-label ${styles.label}`} htmlFor={id}>
        {name instanceof Array ? name.at(-1) : name}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={editingJson}
        onChange={handleJsonChange}
        className={`simple-object-editor-input ${styles.input} ${styles.freeInput}`}
        onBlur={endJsonMode}
        onKeyDown={preventEnterKey}
      />
      {message && (
        <div className={`simple-object-editor-description ${styles.description}`}>{message}</div>
      )}
    </div>
  ) : (
    <div className={`simple-object-editor-control ${styles.control}`}>
      <label className={`simple-object-editor-label ${styles.label}`} htmlFor={id}>
        {name instanceof Array ? name.at(-1) : name}
      </label>
      <div className={`simple-object-editor-input-container ${styles.inputContainer}`}>
        <Input id={id} value={defaultValue} onChange={handleChange} />
          <button type="button" className={`simple-object-editor-button ${styles.button}`} title="自由入力" onClickCapture={startJsonMode}>
            {defaultValue === null
              ? <span className={`simple-object-editor-type-icon-null ${styles.typeIconNull}`} />
              : <span className={`simple-object-editor-type-icon ${styles.typeIcon}`}>{convertToTypeLabel(defaultValue)}</span>
            }
          </button>
      </div>
      {message && (
        <div className={`simple-object-editor-description ${styles.description}`}>{message}</div>
      )}
    </div>
  );
};




export default InputControl;