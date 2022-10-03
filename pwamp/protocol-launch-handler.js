import { importSongFromURL } from "./importer.js";
import { startApp } from "./app.js";
import { getSongNameFromURL } from "./utils.js";
import { applyCustomSkin }  from "./skin.js";

const url = document.location.href;
const commandUrl = new URL(url).searchParams.get('cmd');

// The protocol handler supports the following "commands":
// - Adding a remote song to the library: web+amp:remote-song:<http-url-of-song>
// - Sharing a skin: web+amp:skin:<http-url-of-skin>

if (commandUrl) {
  const commandAndArg = commandUrl.substring('web+amp:'.length);
  // Split the commandAndArg string around the first colon.
  const [command, arg] = commandAndArg.split(/:(.+)/);

  if (command === 'remote-song') {
    importSongFromURL(arg, getSongNameFromURL(arg)).then(startApp);
  } else if (command === 'skin') {
    fetch(arg).then(response => response.text()).then(applyCustomSkin);
  }
}
