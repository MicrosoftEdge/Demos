import { applyCustomSkin } from "./skin.js";
import { importSongFromFile } from "./importer.js";
import { startApp } from "./app.js";
import { getFileNameWithoutExtension } from "./utils.js";

async function handleFiles(files) {
  let needRestart = false;

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
      await importSongFromFile(blob, getFileNameWithoutExtension(file.name));
      needRestart = true;
    }
  }

  if (needRestart) {
    await startApp();
  }
}

if ('launchQueue' in window) {
  launchQueue.setConsumer(launchParams => {
    handleFiles(launchParams.files);
  });
}
