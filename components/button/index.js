import { MoonLoader } from 'react-spinners';
import styles from './styles.module.scss';

function Button({
  label = 'APERTE',
  onClick = () => {},
  loading = false,
  disabled = false,
}) {
  return (
    <button
      className={styles.buttonStyle}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {!loading && label}
      {loading && <MoonLoader size={16} />}
    </button>
  );
}

export default Button;
