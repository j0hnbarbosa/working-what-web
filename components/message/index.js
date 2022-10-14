import React from 'react';
import styles from './styles.module.scss';

function Message({
  message = "",
  error = false
}) {
  return (
    <div className={`${styles.container} ${error ? styles.error : ''}`}>
      {message}
    </div>
  )
}

export default Message