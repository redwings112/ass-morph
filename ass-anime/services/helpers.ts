// helpers.ts

// Function to format time in seconds to MM:SS format
export const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  // Function to shuffle an array (e.g., shuffle playlist)
  export const shuffleArray = <T>(array: T[]): T[] => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  
  // Function to get the next song in the playlist, looping to the start if necessary
  export const getNextSong = (currentIndex: number, playlistLength: number): number => {
    return (currentIndex + 1) % playlistLength;
  };
  
  // Function to get the previous song in the playlist, looping to the end if necessary
  export const getPrevSong = (currentIndex: number, playlistLength: number): number => {
    return (currentIndex - 1 + playlistLength) % playlistLength;
  };
  
  // Function to check if the song is the last one in the playlist
  export const isLastSong = (currentIndex: number, playlistLength: number): boolean => {
    return currentIndex === playlistLength - 1;
  };
  
  // Function to check if the song is the first one in the playlist
  export const isFirstSong = (currentIndex: number): boolean => {
    return currentIndex === 0;
  };
  
  export const isValidAudio = (audioUrl: string): boolean => {
    // Ensure the URL is not empty or just spaces
    return typeof audioUrl === 'string' && audioUrl.trim() !== '';
  };
  
  // Example function to manage playlist (add or remove songs)
  export const managePlaylist = (playlist: string[], action: 'add' | 'remove', song?: string): string[] => {
    if (action === 'add' && song) {
      return [...playlist, song];
    } else if (action === 'remove' && song) {
      return playlist.filter((s) => s !== song);
    }
    return playlist;
  };
  
  // Function to get the name of the song from the URL (assuming URL includes the filename)
  export const getSongNameFromUrl = (url: string): string => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0]; // Remove file extension
  };
  