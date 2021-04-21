import styles from './styles.module.scss'

export function Header() {

  const currentDate = new Date().toLocaleDateString()

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Poadcastr" />

      <p>O melhor para você ouvir sempre</p>
      <span>Qui, 8 abril</span>
    </header>
  );
}