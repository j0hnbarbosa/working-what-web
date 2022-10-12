import styles from './styles.module.scss';

function Button({
  label = "APERTE",
  onClick = () => { }
}) {
  return (
    <button
      className={styles.buttonStyle}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Button