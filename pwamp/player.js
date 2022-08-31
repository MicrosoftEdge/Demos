import { getSongs, getArtworks } from "./store.js";

let songs = [];
let artworks = {};
let currentIndex = 0;

async function initializePlaylist() {
  artworks = await getArtworks();

  songs = await getSongs();
  for (const song of songs) {
    const artwork = artworks[`${song.artist}-${song.album}`];
    if (artwork) {
      song.artworkUrl = typeof artwork === 'string' ? artwork : URL.createObjectURL(artwork);
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
