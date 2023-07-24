import { useState } from 'react';
import { ObjectEditType, ObjectKey, ObjectData } from '../types';
import { getDataItem, removedData, stringToKebabCase, updatedData } from '../utillity';
import InputGroup from './InputGroup';
import JsonInput from './JsonInput';
import styles from './SimpleObjectEditor.module.css';
import { ClassNamePrefixContext as ClassNameContext } from '../useClassName';

type Props<Data extends ObjectData> = {
  data: Data, excludes?: (keyof Data)[];
  samples?: Data[];
  onChange: (newData: Data) => void;
  className?: string;
  classNamePrefix?: string;
}

/**
 * オブジェクトを編集するフォーム
 * @param props.data 編集するデータ
 * @param props.excludes 編集から除外するキー
 * @param props.samples 配列を追加する際に使用するサンプル
 * @param props.onChange データの更新があったときの処理
 * @returns
 */
const SimpleObjectEditor = <Data extends ObjectData,>({ data, excludes = [], samples = [], onChange, className = '', classNamePrefix = '' }: React.PropsWithChildren<Props<Data>>): React.ReactElement<any, any> => {
  const [jsonMode, setJsonMode] = useState(false);

  const handleChange = (actionType: ObjectEditType, key: ObjectKey, value: any) => {
    let newData;
    switch (actionType) {
      case ObjectEditType.Update:
        // 値更新
        newData = updatedData(data, key, () => value);
        onChange(newData);
        break;
      case ObjectEditType.Append:
        // リストに要素追加 (最後の配列要素を複製)
        newData = updatedData(data, key, (items) => {
          if (!(items instanceof Array)) return undefined;
          let lastItem = items.at(-1);

          // リストが空の場合はサンプルデータから検索する
          if (!lastItem) {
            samples.some((sample) => {
              lastItem = getDataItem(sample, key, (sampleTarget: any, sampleLastKey: string | number) => {
                const otherItems = sampleTarget[sampleLastKey];
                if (!(otherItems instanceof Array)) return false;
                return otherItems.at(-1);
              });
              return lastItem;
            });
          }
          return [...items, structuredClone(lastItem ?? '')];
        });
        break;
      case ObjectEditType.Remove:
        // リストから要素削除
        newData = removedData(data, key);
        break;
    }
    onChange(newData!);
  };

  /**
   * JSON編集が確定されたときの処理
   * @param newData
   */
  const handleJsonChange = (newData: Data) => {
    setJsonMode(false);
    onChange(newData);
  };

  /**
   * CSSクラス名を作成
   * @param names
   * @returns クラス名
   */
  const createClassName = (...names: string[]): string => {
    const classNames: string[] = [];
    names.forEach(name => {
      classNames.push(styles[name])
      if (classNamePrefix) {
        classNames.push(`${classNamePrefix}-${stringToKebabCase(name)}`)
      }
    });
    return classNames.join(' ');
  }

  return (
    <ClassNameContext.Provider value={createClassName}>
      <div className={`${className} ${styles.root}`}>
        {jsonMode
          ? <JsonInput data={data} onChange={handleJsonChange} />
          : Object.entries(data).map(([key, value]) => !excludes.includes(key as keyof Data) && (
            <InputGroup key={key} name={key} value={value} onChange={handleChange} />
          ))
        }
        {!jsonMode && <button type="button" className={`simple-object-editor-button ${styles.button} ${styles.jsonButton}`} onClick={() => setJsonMode(true)}>{'{ }'}</button>}
      </div>
    </ClassNameContext.Provider>
  );
};

export default SimpleObjectEditor;
