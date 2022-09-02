import { importSongFromURL } from "./importer.js";
import { startApp } from "./app.js";
import { getSongNameFromURL } from "./utils.js";

const url = document.location.href;
const remoteSongProtocol = new URL(url).searchParams.get('addRemoteSong');

if (remoteSongProtocol) {
  let songUrl = remoteSongProtocol.substring('web+amp://'.length);

  if (!songUrl.startsWith('http')) {
    songUrl = 'https://' + songUrl;
  }

  importSongFromURL(songUrl, getSongNameFromURL(songUrl)).then(startApp);
}
