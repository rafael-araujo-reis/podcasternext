import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';

import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'


export function Player() {

  // uma boa prática é iniciar o useRef como null
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglerPlay,
    playNext,
    playPrevious,
    setPlayingState
  } = useContext(PlayerContext)
  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  })

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        {/* usa-se episode?.title, para verificar se tem algum valor tocando e então exibir o title */}
        <strong>Tocando agora</strong>
      </header>


      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {/* use-se nesse formato com && se quiser executar o IF e || se quiser executar o else apenas */}
        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Tocar anterior" onClick={playPrevious} />
          </button>
          <button type="button" disabled={!episode} className={styles.playerButton} onClick={togglerPlay}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}