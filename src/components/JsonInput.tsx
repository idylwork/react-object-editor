import {
  useEffect, useId, useRef, useState,
} from 'react';
import useClassName from '../useClassName';

type Props<Data> = { data: Data; onChange: (newData: Data) => void; }

/**
 * 入力フォームコンポーネント
 * @param data - 編集するデータ
 * @param onChange - JSON変更確定時の処理
 */
const JsonInput = <Data, >({ data, onChange }: React.PropsWithChildren<Props<Data>>): React.ReactElement<any, any> => {
  /** 表示用の値 */
  const [json, setJson] = useState(() => JSON.stringify(data, null, 2));
  /** エラーメッセージ */
  const [message, setMessage] = useState('');
  /** 入力フォームのID */
  const id = useId();
  /** クラス名の作成 */
  const createClassName = useClassName();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  /** フォーム入力時の処理 */
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJson(event.currentTarget.value);
  };

  // コンポーネント表示時、自動で入力フォームにフォーカスする
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

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
    <div className={createClassName('control', 'jsonControl')}>
      <label className={createClassName('label')} htmlFor={id}>
        JSON
      </label>
      <textarea
        ref={inputRef}
        id={id}
        value={json}
        onChange={handleChange}
        onBlur={parse}
        className={createClassName('input', 'freeInput', 'jsonInput')}
      />
      {message && (
        <div className={createClassName('description')}>{message}</div>
      )}
    </div>
  );
};

export default JsonInput;
