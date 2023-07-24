import { ObjectEditType, ObjectKey } from '../types'
import useClassName from '../useClassName';
import InputControl from './InputControl';

type Props<T> = { name: ObjectKey, value: T; onChange: (actionType: ObjectEditType, key: ObjectKey, value: T) => void; }

const InputGroup = <T,>({ name, value, onChange }: React.PropsWithChildren<Props<T>>): React.ReactElement<any, any> => {
  /** クラス名の作成 */
  const createClassName = useClassName();

  const keys = name instanceof Array ? name : [name];

  const handleChange = (key: ObjectKey, newValue: T) => {
    onChange(ObjectEditType.Update, key, newValue);
  };

  if (value instanceof Array) {
    return <div>
      <div className={createClassName('label')}>
        <div>{keys.at(-1)}</div>
        <button type="button" className={createClassName('button')} onClick={() => onChange(ObjectEditType.Append, keys, value)}>
          +
        </button>
      </div>
      <div className={createClassName('group')}>
        {value.map((nextValue, index) => (
          <div className={createClassName('listItem')} key={[...keys, index].join('.')}>
            <InputGroup name={[...keys, index]} value={nextValue} onChange={onChange} />
            <button type="button" className={createClassName('button')} onClick={() => onChange(ObjectEditType.Remove, [...keys, index], value)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  } else if (value instanceof Object && value !== null) {
    return <div className={createClassName('control')}>
      <div className={createClassName('label')}>{keys.at(-1)}</div>
      <div className={createClassName('group')}>
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