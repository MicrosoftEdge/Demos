import logo from './logo.svg';
import styles from './AppLogo.module.sass';

function AppLogo() {
  return (
    <img src={logo} className={styles['App-logo']} alt="logo" />
  );
}

export default AppLogo;
