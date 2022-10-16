import { useState, useRef } from 'react';
import useClickOutside from '../../utils/useClickOutside';
import styles from './styles.module.scss';

function Dropdown({
  options = [],
  label = "",
  onChange = () => { },
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ text: label || "Select" });

  const wrapperRef = useRef(null);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClickOption = (item) => {
    setSelected(item);
    onChange(item);

    handleClose();
  }

  useClickOutside(wrapperRef, handleClose);

  return (
    <div className={styles.container} ref={wrapperRef}>

      <div
        onClick={handleOpen}
        className={styles.headerSelect}
      >
        {selected.text}
        <div className={styles.arrowDown}></div>
      </div>

      {open && <div
        className={styles.optionsContainer}
      >
        {options.map((item) => {
          const selectedItem = item.key === selected.key ? styles.slectedActive : '';
          return (
            <div
              key={item.key}
              className={`${styles.options} ${selectedItem}`}
              onClick={() => handleClickOption(item)}
            >
              {item.text}
            </div>

          )
        })}
      </div>}
    </div>
  )
}

export default Dropdown