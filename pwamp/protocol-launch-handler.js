import { importSongFromURL } from "./importer.js";
import { startApp } from "./app.js";
import { getSongNameFromURL } from "./utils.js";

const url = document.location.href;
const remoteSongProtocol = new URL(url).searchParams.get('addRemoteSong');

if (remoteSongProtocol) {
  const songUrl = remoteSongProtocol.substring('web+amp:'.length);
  importSongFromURL(songUrl, getSongNameFromURL(songUrl)).then(startApp);
}
