const fileContent = document.getElementById('file-content');
const fileName = document.getElementById('filename');

if ('launchQueue' in window) {
  launchQueue.setConsumer(launchParams => {
    handleFiles(launchParams.files);
  });
} else {
  console.error('PWA file_handlers is not supported!');
}

async function handleFiles(files) {
  if (!files.length) {
    console.log('No files to handle');
    return;
  }

  // Only handle the first text file.
  for (const file of files) {
    const blob = await file.getFile();
    blob.handle = file;

    if (blob.type === "text/plain") {
      const text = await blob.text();

      fileName.textContent = file.name;
      fileContent.value = text;
      break;
    }

    console.log(`${file.name} is not a text file, skipping.`);
  }
}
