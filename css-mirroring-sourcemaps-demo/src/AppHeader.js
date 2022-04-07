import AppLink from './AppLink.js';
import AppLogo from './AppLogo.js';
import styles from './AppHeader.module.css';

function AppHeader() {
  return (
    <header className={styles['App-header']}>
      <AppLogo />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <AppLink />
    </header>
  );
}

export default AppHeader;
