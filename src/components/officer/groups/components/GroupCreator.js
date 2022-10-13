import { useEffect, useState } from "react";
import style from './style.module.css';

function GroupCreator({ title, subTitle, required, placeholder, type, onChange }) {
  const [val, setVal] = useState('');

  useEffect(() => {
    onChange && onChange(val);
  }, [val]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <h2>{title}</h2>
      </div>
      <div className={style.content}>
        <h3>{subTitle}
          {required && <span style={{ color: 'red' }}>*</span>}
        </h3>
        {type === 'input' && <input
          required={required}
          value={val}
          onChange={e => setVal(e.target.value)}
          className={style.input}
          placeholder={placeholder} />}
        {type === 'textarea' && (
          <textarea
            name={'description'}
            rows={4}
            required={required}
            value={val}
            onChange={e => setVal(e.target.value)}
            className={style.input}
            placeholder={placeholder}>{placeholder}</textarea>
        )}
      </div>
    </div>
  )
}

export default GroupCreator;