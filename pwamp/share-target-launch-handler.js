import { get, del } from './idb-keyval.js';
import { importSongsFromFiles } from "./importer.js";
import { startApp } from "./app.js";
import { createLoadingSongPlaceholders } from "./song-ui-factory.js";

// If a song was shared with the app by using the PWA share target feature,
// then that song will be in the "handled-shared-song" key in IDB, thanks
// to our service-worker. So pick it up now, add it, and clean the key.
get('handle-shared-files').then(async (files) => {
  if (files) {
    createLoadingSongPlaceholders(document.querySelector(".playlist .songs"), files.length);

    await importSongsFromFiles(files);
  
    await startApp();
    await del('handle-shared-files');
  }
});
