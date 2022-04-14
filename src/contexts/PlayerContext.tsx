import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  setPlayingState: (state: boolean) => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1;
  const hasPrevious = currentEpisodeIndex > 0;

  function play(episode: Episode) {
    console.log("passo play");
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0); //force return 0
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    console.log("passo playList");
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    console.log("passo toogle play");
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    console.log("passo toogle loop");
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    console.log("passo toogle shuffle");
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    console.log("passo set playing state");
    setIsPlaying(state);
  }

  function playNext() {
    console.log("passo play next");
    const nextCurrentEpisodeIndex = currentEpisodeIndex + 1;
    if (isShuffling) {
      const nextShuffleEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      );
      setCurrentEpisodeIndex(nextShuffleEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(nextCurrentEpisodeIndex);
    }
  }

  function playPrevious() {
    console.log("passo play previous");
    const previousCurrentEpisodeIndex = currentEpisodeIndex - 1;
    if (hasPrevious) {
      setCurrentEpisodeIndex(previousCurrentEpisodeIndex);
    }
  }

  function clearPlayerState() {
    console.log("passo clear player state");
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        playNext,
        playPrevious,
        setPlayingState,
        hasPrevious,
        hasNext,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
