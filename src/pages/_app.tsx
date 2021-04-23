import '../styles/global.scss'

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <PlayerContext.Provider value={'Diego'}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </PlayerContext.Provider>
    </div>
  );
}

export default MyApp;
