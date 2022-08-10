import { get, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
import { importSongFromFile } from "./importer.js";
import { startApp } from "./app.js";
import { guessSongInfo } from "./utils.js";
import { createLoadingSongPlaceholders } from "./song-ui-factory.js";

// If a song was shared with the app by using the PWA share target feature,
// then that song will be in the "handled-shared-song" key in IDB, thanks
// to our service-worker. So pick it up now, add it, and clean the key.
get('handle-shared-files').then(async (files) => {
  if (files) {
    createLoadingSongPlaceholders(document.querySelector(".playlist .songs"), files.length);

    for (const file of files) {
      const { artist, album, title } = await guessSongInfo(file);
      await importSongFromFile(file, title, artist, album);
    }
  
    await startApp();
    await del('handle-shared-files');
  }
});
