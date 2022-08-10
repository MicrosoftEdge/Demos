import parseAudioMetadata from "./parseAudioMetadata.js";

onmessage = async (e) => {
  console.log('Worker: Message received from main script');

  const metadata = await parseAudioMetadata(e.data);
  console.log(metadata);

  postMessage({
    album: metadata.album,
    artist: metadata.artist,
    title: metadata.title
  });
};
