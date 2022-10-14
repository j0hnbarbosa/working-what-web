import styles from './styles.module.scss';
import { MoonLoader } from 'react-spinners'

function Button({
  label = "APERTE",
  onClick = () => { },
  loading = false,
  disabled = false,
}) {
  return (
    <button
      className={styles.buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {!loading && label}
      {loading && <MoonLoader size={16} />}
    </button>
  )
}

export default Button