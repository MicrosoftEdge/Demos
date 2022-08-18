import { applyCustomSkin } from "./skin.js";
import { importSongFromFile } from "./importer.js";
import { startApp, playlistSongsContainer } from "./app.js";
import { createLoadingSongPlaceholders } from "./song-ui-factory.js";

const AUDIO_EXTENSIONS = [".wav", ".mp3", ".mp4", ".adts", ".ogg", ".webm", ".flac"];

async function handleFiles(files) {
  // Check if there will be song files to import, and how many.
  let songFilesToImport = 0;
  for (const file of files) {
    if (AUDIO_EXTENSIONS.includes(file.name.substring(file.name.lastIndexOf(".")).toLowerCase())) {
      songFilesToImport++;
    }
  }

  if (songFilesToImport > 0) {
    createLoadingSongPlaceholders(playlistSongsContainer, songFilesToImport);
  }

  for (const file of files) {
    if (file.name.endsWith(".pwampskin")) {
      // This is a skin file.
      const blob = await file.getFile();
      blob.handle = file;
      const text = await blob.text();
      await applyCustomSkin(text);
    } else {
      // Otherwise it's an audio file.
      const blob = await file.getFile();
      await importSongFromFile(blob);
    }
  }

  if (songFilesToImport > 0) {
    await startApp();
  }
}

if ('launchQueue' in window) {
  launchQueue.setConsumer(launchParams => {
    handleFiles(launchParams.files);
  });
}
