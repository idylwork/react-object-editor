import { useId, useRef, useState } from 'react';
import { ObjectKey, TypeRule, InputType } from '../types';
import Input from './Input';
import { convertToTypeLabel } from '../utillity';
import useClassName from '../useClassName';
import Select from './Select';

type Props<T> = {
  name: ObjectKey;
  value: T;
  typeRule: TypeRule | null;
  onChange: (key: ObjectKey, value: T) => void;
}

/**
 * 入力フォーム項目コンポーネント
 * @param props.name キー名配列
 * @param props.value デフォルト値
 * @param props.typeRule タイプ設定 (NULLで指定なし)
 * @param props.onChange 値変更時の処理
 */
const InputControl = <T, >({
  name, value, typeRule = null, onChange,
}: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> | null => {
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
  /** クラス名の作成 */
  const createClassName = useClassName();
  /** フォームのデフォルト値 */
  let defaultValue = value;

  if (typeRule) {
    // typesに非表示指定
    if (typeRule.inputType === InputType.None) {
      return null;
    }

    // typesが指定された場合は型を強制
    defaultValue = typeRule.cast(defaultValue) as T;
  }

  /** フォーム入力時の処理 */
  const handleChange = (newValue: T | null) => {
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

  /**
   * 自由入力の値変更時の処理
   * @param event
   */
  const handleFreeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingJson(event.currentTarget.value);
  };

  /**
   * 自由入力の開始
   */
  const startFreeInput = () => {
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

  /**
   * 自由入力の終了
   */
  const endFreeInput = () => {
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
      endFreeInput();
    }
  };

  // 自由入力モード
  if (isFreeInputEnabled) {
    return (
      <div className={createClassName('control')}>
        <label className={createClassName('label')} htmlFor={id}>
          {name instanceof Array ? name.at(-1) : name}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={editingJson}
          onChange={handleFreeInputChange}
          className={createClassName('input', 'freeInput')}
          onBlur={endFreeInput}
          onKeyDown={preventEnterKey}
        />
        {message && (
          <div className={createClassName('description')}>{message}</div>
        )}
      </div>
    );
  }

  // 動的型入力フォーム・セレクトボックス
  return (
    <div className={createClassName('control')}>
      <label className={createClassName('label')} htmlFor={id}>
        {name instanceof Array ? name.at(-1) : name}
      </label>
      {typeRule?.inputType === InputType.Select ? (
        <Select id={id} value={defaultValue} typeRule={typeRule} onChange={handleChange} setMessage={setMessage} />
      ) : (
        <div className={createClassName('inputContainer')}>
          <Input id={id} value={defaultValue} typeRule={typeRule} onChange={handleChange} />
          {!typeRule && (
            <button type="button" className={createClassName('button')} title="自由入力" onClickCapture={startFreeInput}>
              {defaultValue === null
                ? <span className={createClassName('typeIconNull')} />
                : <span className={createClassName('typeIcon')}>{convertToTypeLabel(defaultValue)}</span>}
            </button>
          )}
        </div>
      )}
      {message && (
        <div className={createClassName('description')}>{message}</div>
      )}
    </div>
  );
};

export default InputControl;
