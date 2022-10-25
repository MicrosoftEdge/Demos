import { hasRemoteURLSong, addRemoteURLSong, addLocalFileSong, addMultipleLocalFileSongs } from "./store.js";
import { formatTime, guessSongInfo } from "./utils.js";

// To add new songs into the store, the app uses this importer instead of the
// store functions directly.
// The reason is that the importer's added value is to pre-load the song and
// get its duration, which the store does not do.
// The importer can also return some user friendly error messages if the song
// can't be imported.

/**
 * Attempt to import a new song into the store, given a URL, title, artist
 * and album.
 * If the song already exists (based on URL) or if the URL didn't return a
 * valid audio file, then an error message is returned.
 */
export async function importSongFromURL(url, title = 'Unknown', artist = 'Unknown artist', album = 'Unknown album') {
  const alreadyExists = await hasRemoteURLSong(url);
  if (alreadyExists) {
    return { error: true, message: 'Song already exists' };
  }

  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }

  const duration = await getSongDuration(url);
  if (duration === -1) {
    return { error: true, message: 'URL is not a valid audio file' };
  }

  await addRemoteURLSong(url, title, artist, album, formatTime(duration));

  return { error: false };
}

function turnFileIntoURL(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = e => {
      resolve(e.target.result);
    }
    fileReader.readAsDataURL(file);
  });
}

/**
 * Import multiple songs from files at once into the store.
 * @param {Array} files 
 */
export async function importSongsFromFiles(files) {
  if (!Array.isArray(files)) {
    files = [...files];
  }

  const songs = [];

  // We can do this part in parallel.
  await Promise.all(files.map(async file => {
    const { title, artist, album } = await guessSongInfo(file)

    const url = await turnFileIntoURL(file);
    const duration = await getSongDuration(url);

    songs.push({ title, artist, album, duration: formatTime(duration), file });
  }));

  // And then add all songs in one go in the storage.
  await addMultipleLocalFileSongs(songs);
}

/**
 * DO NOT LOOP OVER THIS FUNCTION TO IMPORT SEVERAL SONGS, THIS WILL LEAD TO
 * AN INCONSISTENT STORE STATE. USE importSongsFromFiles() INSTEAD.
 * Attempt to import a new song into the store from a File object.
 * If the file could not be read as an audio file an error message is returned.
 */
export async function importSongFromFile(file) {
  const { title, artist, album } = await guessSongInfo(file)
  const url = await turnFileIntoURL(file);
  const duration = await getSongDuration(url);

  await addLocalFileSong(file, title, artist, album, formatTime(duration));

  return { error: false };
}

/**
 * Given a URL, try to load it as an Audio source and get the duration.
 * Returns -1 if the URL is not a valid audio file.
 */
async function getSongDuration(url) {
  // FIXME: this function returns Infinity for audio recordings...
  const tempAudio = new Audio();

  let error = null;
  const errorPromise = new Promise(r => {
    tempAudio.onerror = e => {
      error = e;
      r();
    }
  });
  const loadedPromise = new Promise(r => tempAudio.oncanplaythrough = r);
  const timeoutPromise = new Promise(r => setTimeout(() => {
    error = 'Timeout';
    r();
  }, 2000));

  // Load the audio file.
  tempAudio.src = url;

  // Wait for either an error or the audio to load.
  await Promise.race([errorPromise, loadedPromise, timeoutPromise]);

  return error ? -1 : tempAudio.duration;
}
