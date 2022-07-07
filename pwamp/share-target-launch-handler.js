import { get, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
import { importSongFromFile } from "./importer.js";
import { startApp } from "./app.js";
import { getFileNameWithoutExtension } from "./utils.js";

// If a song was shared with the app by using the PWA share target feature,
// then that song will be in the "handled-shared-song" key in IDB, thanks
// to our service-worker. So pick it up now, add it, and clean the key.
get('handled-shared-song').then(async (file) => {
  if (file) {
    await importSongFromFile(file, getFileNameWithoutExtension(file.name));
    await del('handled-shared-song');
    await startApp();
  }
});
