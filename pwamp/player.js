import { getSongs, getArtworks } from "./store.js";

let songs = [];
let artworks = {};
let currentIndex = 0;

async function initializePlaylist() {
  songs = await getSongs();
  artworks = await getArtworks();
  for (const song of songs) {
    const artwork = artworks[`${song.artist}-${song.album}`];
    if (artwork) {
      song.artworkUrl = typeof artwork === 'string' ? artwork : URL.createObjectURL(artwork);
    }
  }

  // If there was a current index set, set it to the correct value.
  // The current song might have moved to a new position.
  if (currentIndex) {
    const currentSong = songs[currentIndex];
    if (currentSong) {
      currentIndex = songs.indexOf(currentSong);
    }
  }
}

export class Player extends EventTarget {
  constructor() {
    super();

    this.audio = new Audio();
    this.song = null;

    this.isPlaying = false;

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playNext();
    });

    this.audio.addEventListener('error', e => {
      this.dispatchEvent(new Event('error'));
    });

    this.audio.addEventListener('play', e => {
      this.dispatchEvent(new Event('playing'));
    });
  }

  async loadPlaylist() {
    await initializePlaylist();
    return songs;
  }

  load(song) {
    this.song = song;

    if (!song.type || song.type === 'url') {
      this.audio.src = song.id;
    } else if (song.type === 'file') {
      const url = URL.createObjectURL(song.data);
      this.audio.src = url;
    }

    this.audio.addEventListener('canplaythrough', () => {
      this.dispatchEvent(new Event('canplay'));
    }, { once: true });
  }

  play(song) {
    let newSongWasLoaded = false;

    if (!songs.length) {
      return;
    }

    // If a specific song is passed, load it first.
    if (song) {
      this.load(song);
      newSongWasLoaded = true;
    }

    // Otherwise just play the current song.
    // Although if none was loaded, then that's the default
    // state, and we should load the first song.
    if (!this.song) {
      this.load(songs[0]);
      newSongWasLoaded = true;
    }

    this.audio.play();
    this.isPlaying = true;

    currentIndex = songs.indexOf(this.song);

    if (!newSongWasLoaded) {
      this.dispatchEvent(new Event('canplay'));
    }
  }

  playPrevious() {
    if (currentIndex === 0) {
      this.play(songs[0]);
    }
    this.play(songs[currentIndex - 1]);
  }

  playNext() {
    if (currentIndex < songs.length - 1) {
      this.play(songs[currentIndex + 1]);
    }
  }

  pause() {
    if (!this.song) {
      return;
    }

    this.audio.pause();
    this.isPlaying = false;

    this.dispatchEvent(new Event('paused'));
  }

  get volume() {
    return this.audio.volume;
  }

  set volume(volume) {
    this.audio.volume = volume;
  }

  get currentTime() {
    return this.audio.currentTime;
  }

  set currentTime(time) {
    if (!this.song) {
      return;
    }

    this.audio.currentTime = time;
  }

  get duration() {
    return this.audio.duration;
  }
}
