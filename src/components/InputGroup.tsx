import { ObjectEditType, ObjectKey } from '../types'
import InputControl from './InputControl';
import styles from './SimpleObjectEditor.module.css';

type Props<T> = { name: ObjectKey, value: T; onChange: (actionType: ObjectEditType, key: ObjectKey, value: T) => void; }

const InputGroup = <T,>({ name, value, onChange }: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> => {
  const keys = name instanceof Array ? name : [name];

  const handleChange = (key: ObjectKey, newValue: T) => {
    onChange(ObjectEditType.Update, key, newValue);
  };

  if (value instanceof Array) {
    return <div>
      <div className={`simple-object-editor-label ${styles.label}`}>
        <div>{keys.at(-1)}</div>
        <button type="button" className={`simple-object-editor-button ${styles.button}`} onClick={() => onChange(ObjectEditType.Append, keys, value)}>
          +
        </button>
      </div>
      <div className={`simple-object-editor-group ${styles.group}`}>
        {value.map((nextValue, index) => (
          <div className={styles.listItem} key={[...keys, index].join('.')}>
            <InputGroup name={[...keys, index]} value={nextValue} onChange={onChange} />
            <button type="button" className={`simple-object-editor-button ${styles.button}`} onClick={() => onChange(ObjectEditType.Remove, [...keys, index], value)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  } else if (value instanceof Object && value !== null) {
    return <div className={`simple-object-editor-control ${styles.control}`}>
      <div className={`simple-object-editor-label ${styles.label}`}>{keys.at(-1)}</div>
      <div className={`simple-object-editor-group ${styles.group}`}>
        {Object.entries(value).map(([nextKey, nextValue]) => (
          <InputControl key={nextKey} name={[...keys, nextKey]} value={nextValue} onChange={handleChange} />
        ))}
      </div>
    </div>
  } else {
    return <InputControl name={name} value={value} onChange={handleChange} />
  }
}

export default InputGroup;