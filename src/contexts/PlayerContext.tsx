import { createContext, useState, ReactNode } from 'react'

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
}

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  isPlaying: boolean,
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  togglerPlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0); //force return 0
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglerPlay() {
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function playNext() {
    const nextCurrentEpisodeIndex = currentEpisodeIndex + 1;
    if (currentEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(nextCurrentEpisodeIndex)
    }
  }

  function playPrevious() {
    const previousCurrentEpisodeIndex = currentEpisodeIndex - 1;
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(previousCurrentEpisodeIndex)
    }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      playList,
      isPlaying,
      togglerPlay,
      playNext,
      playPrevious,
      setPlayingState
    }}>
      {children}
    </PlayerContext.Provider>
  )
}