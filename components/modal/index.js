import React from 'react';
import style from './styles.module.scss';

function Modal({
  open = false, onClose = () => {}, children, header = '',
}) {
  if (!open) return null;

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.close} onClick={onClose}>
          X
        </div>
        <div className={style.header}>{header}</div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
