import { useEffect, useId, useRef, useState } from 'react';
import styles from './SimpleObjectEditor.module.css';

type Props<Data> = { data: Data; onChange: (newData: Data) => void; }

/**
 * 入力フォームコンポーネント
 * @param data - 編集するデータ
 * @param onChange - JSON変更確定時の処理
 */
const JsonInput = <Data,>({ data, onChange }: React.PropsWithChildren<Props<Data>>): React.ReactElement<any, any> => {
  /** 表示用の値 */
  const [json, setJson] = useState(() => JSON.stringify(data, null, 2));
  /** エラーメッセージ */
  const [message, setMessage] = useState('');
  /** 入力フォームのID */
  const id = useId();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  /** フォーム入力時の処理 */
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.currentTarget.value);
  };

  // コンポーネント表示時、自動で入力フォームにフォーカスする
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef])

  /**
   * JSONをパースしてデータの変更を伝える
   */
  const parse = () => {
    try {
      const newData = JSON.parse(json);
      setMessage('');
      onChange(newData);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  return (
    <div className={`simple-object-editor-control ${styles.control} ${styles.jsonControl}`}>
      <label className={`simple-object-editor-label ${styles.label}`} htmlFor={id}>
        JSON
      </label>
      <textarea
        ref={inputRef}
        id={id}
        value={json}
        onChange={handleChange}
        onBlur={parse}
        className={`simple-object-editor-input ${styles.input} ${styles.freeInput} ${styles.jsonInput}`}
      />
      {message && (
        <div className={`simple-object-editor-description ${styles.description}`}>{message}</div>
      )}
    </div>
  );
};

export default JsonInput;