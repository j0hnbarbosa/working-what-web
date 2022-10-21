import React from 'react';
import styles from './styles.module.scss';

function InputLabel({
  label = '',
  name = '',
  onChange = () => {},
  onKeyDown = () => {},
  value = '',
  placeholder = '',
}) {
  return (
    <div className={styles.container}>
      <label className={styles.labelStyle} htmlFor={name}>
        {label}
      </label>
      <input
        className={styles.inputStyle}
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputLabel;
