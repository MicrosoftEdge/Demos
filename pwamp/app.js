import { getSongs, editSong, setVolume, getVolume, deleteSong, deleteAllSongs, addLocalFileSong } from "./store.js";
import { Player } from "./player.js";
import { formatTime, openFilesFromDisk, getFormattedDate, canShare, guessSongInfo } from "./utils.js";
import { importSongFromFile } from "./importer.js";
import { Visualizer } from "./visualizer.js";
import { exportSongToFile } from "./exporter.js";
import { loadCustomOrResetSkin, reloadStoredCustomSkin } from "./skin.js";
import { startRecordingAudio, stopRecordingAudio } from "./recorder.js";
import { createSongUI, removeAllSongs, createLoadingSongPlaceholders, removeLoadingSongPlaceholders } from "./song-ui-factory.js";

// All of the UI DOM elements we need.
const playButton = document.getElementById("playpause");
const playButtonLabel = playButton.querySelector("span");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const playHeadInput = document.getElementById("playhead");
const visualizerButton = document.getElementById("toggle-visualizer");
const visualizerEl = document.getElementById("waveform");
const volumeInput = document.getElementById("volume");
const currentTimeLabel = document.getElementById("currenttime");
const durationLabel = document.getElementById("duration");
const playlistEl = document.querySelector(".playlist");
export const playlistSongsContainer = document.querySelector(".playlist .songs");
const addSongsButton = document.getElementById("add-songs");
const songActionsPopup = document.getElementById("song-actions-popup");
const songActionDelete = document.getElementById("song-action-delete");
const songActionExport = document.getElementById("song-action-export");
const songActionShare = document.getElementById("song-action-share");
const playlistActionsButton = document.getElementById("playlist-actions");
const playlistActionsPopup = document.getElementById("playlist-actions-popup");
const playlistActionDeleteAll = document.getElementById("playlist-action-delete");
const playlistActionExportAll = document.getElementById("playlist-action-export");
const loadCustomSkinButton = document.getElementById("load-custom-skin");
const recordAudioButton = document.getElementById("record-audio");

// Instantiate the player object. It will be used to play/pause/seek/... songs. 
const player = new Player();

// Instantiate the visualizer object to draw the waveform.
const visualizer = new Visualizer(player, visualizerEl);

// Aa simple interval loop is used to update the UI (e.g. the playhead and current time).
let updateLoop = null;

// The update loop.
function updateUI() {
  // Reset the play states in the playlist. We'll update the current one below.
  playlistSongsContainer.querySelectorAll(".playing").forEach(el => el.classList.remove('playing'));
  playButton.classList.remove('playing');
  playButtonLabel.textContent = 'Play';
  playButton.title = 'Play';
  document.documentElement.classList.toggle('playing', false);

  if (!player.song) {
    // No song is loaded. Show the default UI.
    playHeadInput.value = 0;
    currentTimeLabel.textContent = "00:00";
    durationLabel.textContent = "00:00";

    return;
  }

  // Update the play head and current time/duration labels.
  const currentTime = player.currentTime;
  const duration = player.duration;

  playHeadInput.value = currentTime;
  playHeadInput.max = duration;

  currentTimeLabel.innerText = formatTime(currentTime);
  durationLabel.innerText = formatTime(duration);

  if (player.isPlaying) {
    playButton.classList.add('playing');
    playButtonLabel.textContent = 'Pause';
    playButton.title = 'Pause';
    document.documentElement.classList.toggle('playing', true);
  }

  // Update the play state in the playlist.
  const currentSong = playlistSongsContainer.querySelector(`[id="${player.song.id}"]`);
  currentSong && currentSong.classList.add('playing');
}

// Calling this function starts (or reloads) the app.
// If the store is changed, you can call this function again to reload the app.
export async function startApp() {
  clearInterval(updateLoop);

  removeLoadingSongPlaceholders(playlistSongsContainer);

  // Restore the volume from the store.
  const previousVolume = await getVolume();
  player.volume = previousVolume === undefined ? 1 : previousVolume;
  volumeInput.value = player.volume * 10;

  // Restore the skin from the store.
  await reloadStoredCustomSkin();

  // Reload the playlist from the store.
  const songs = await player.loadPlaylist();

  // Populate the playlist UI.
  removeAllSongs(playlistSongsContainer);
  for (const song of songs) {
    const playlistSongEl = createSongUI(playlistSongsContainer, song);

    playlistSongEl.addEventListener('play-song', () => {
      player.pause();
      player.play(song);
    });

    playlistSongEl.addEventListener('edit-song', e => {
      editSong(song.id, e.detail.title, e.detail.artist, e.detail.album);
    });

    playlistSongEl.addEventListener('show-actions', e => {
      // TODO: anchoring is not yet supported. Once it is, use the ID passed in the event.
      // This is the ID for the button that was clicked.
      // songActionsPopup.setAttribute('anchor', e.detail.id);
      // In the meantime, anchor manually.
      songActionsPopup.style.left = `${e.detail.x}px`;
      songActionsPopup.style.top = `${e.detail.y - playlistEl.scrollTop}px`;

      songActionsPopup.showPopUp();
      songActionsPopup.currentSong = song;

      songActionShare.disabled = !canShare(song);
    });
  }

  playlistEl.classList.toggle('has-songs', songs.length > 0);

  // Start the update loop.
  updateLoop = setInterval(updateUI, 500);
}

// Below are the event handlers for the UI.

// Manage the play button.
playButton.addEventListener("click", () => {
  if (player.isPlaying) {
    player.pause();
  } else {
    player.play();
  }
});

// Seek on playhead input.
playHeadInput.addEventListener("input", () => {
  player.currentTime = playHeadInput.value;
});

// Manage the volume input
volumeInput.addEventListener("input", () => {
  player.volume = volumeInput.value / 10;
  setVolume(player.volume);
});

// Manage the previous and next buttons.
previousButton.addEventListener("click", () => {
  // If this happened in the first few seconds of the song, go to the previous one.
  // Otherwise just restart the current song.
  const time = player.currentTime;
  const isSongStart = time < 3;

  if (isSongStart) {
    player.playPrevious();
  } else {
    player.currentTime = 0;
  }
});

nextButton.addEventListener("click", () => {
  player.playNext();
});

// Listen to player playing/paused status to update the visualizer.
player.addEventListener("canplay", () => {
  isVisualizing() && visualizer.start();
});

player.addEventListener("paused", () => {
  isVisualizing() && visualizer.stop();
});

// Manage the add song button.
addSongsButton.addEventListener("click", async () => {
  const files = await openFilesFromDisk();

  createLoadingSongPlaceholders(playlistSongsContainer, files.length);

  const importErrors = [];
  for (const file of files) {
    const { artist, album, title } = await guessSongInfo(file);
    const importResult = await importSongFromFile(file, title, artist, album);
    if (importResult.error && importResult.message) {
      importErrors.push(importResult.message);
    }
  }

  if (!importErrors.length) {
    await startApp();
  } else {
    console.error(importErrors.join('\n'));
  }
});

// Manage the song actions.
songActionDelete.addEventListener("click", async () => {
  const song = songActionsPopup.currentSong;
  if (!song) {
    return;
  }

  songActionsPopup.currentSong = null;
  songActionsPopup.hidePopUp();

  await deleteSong(song.id);
  await startApp();
});

songActionExport.addEventListener("click", async () => {
  const song = songActionsPopup.currentSong;
  if (!song) {
    return;
  }

  songActionsPopup.currentSong = null;
  songActionsPopup.hidePopUp();

  await exportSongToFile(song);
});

songActionShare.addEventListener("click", async () => {
  const song = songActionsPopup.currentSong;
  if (!song || !canShare(song.data)) {
    return;
  }

  songActionsPopup.currentSong = null;
  songActionsPopup.hidePopUp();

  navigator.share({
    title: song.title,
    files: [song.data]
  });
});

// Manage the custom skin button.
loadCustomSkinButton.addEventListener('click', async () => {
  await loadCustomOrResetSkin();
});

function isVisualizing() {
  return document.documentElement.classList.contains('visualizing');
}

// Manage the visualizer button.
visualizerButton.addEventListener('click', () => {
  const isVis = isVisualizing();

  // If we're asked to visualize but no song is playing, start the first song.
  if (!isVis && !player.isPlaying) {
    player.play();
  }

  const label = isVis ? 'Show visualizer' : 'Stop visualizer';
  visualizerButton.title = label;
  visualizerButton.querySelector('span').textContent = label;

  document.documentElement.classList.toggle('visualizing');

  isVis ? visualizer.stop() : visualizer.start();
});

// Manage the record audio button.
recordAudioButton.addEventListener('click', async () => {
  const isRecording = recordAudioButton.classList.contains('recording');

  recordAudioButton.classList.toggle('recording', !isRecording);
  const label = !isRecording ? 'Stop recording' : 'Record an audio clip';
  recordAudioButton.title = label;
  recordAudioButton.querySelector('span').textContent = label;

  if (isRecording) {
    const { blob, duration } = await stopRecordingAudio();
    // Because audio recordings come with a duration already, no need to call
    // importSongFromFile, we can go straight to addLocalFileSong.
    await addLocalFileSong(blob, getFormattedDate(), 'Me', 'Audio recordings', formatTime(duration));
    await startApp();
  } else {
    await startRecordingAudio();
  }
});

// Manage the more tools button.
playlistActionsButton.addEventListener('click', () => {
  playlistActionsPopup.style.left = `${playlistActionsButton.offsetLeft + (playlistActionsButton.offsetWidth / 2) - (playlistActionsPopup.offsetWidth / 2)}px`;
  playlistActionsPopup.style.top = `calc(${playlistActionsButton.offsetTop - playlistActionsPopup.offsetHeight}px - 1rem)`;
  playlistActionsPopup.showPopUp();
});

playlistActionDeleteAll.addEventListener('click', async () => {
  await deleteAllSongs();
  playlistActionsPopup.hidePopUp();
  await startApp();
});

playlistActionExportAll.addEventListener('click', async () => {
  const songs = await getSongs();
  await Promise.all(songs.map(song => exportSongToFile(song)));
  playlistActionsPopup.hidePopUp();
});


// Manage drag/dropping songs from explorer to playlist.
addEventListener('dragover', e => {
  if (document.documentElement.classList.contains('visualizing')) {
    return;
  }
  e.preventDefault();
  document.documentElement.classList.add('drop-target');
});

addEventListener('dragleave', e => {
  if (document.documentElement.classList.contains('visualizing')) {
    return;
  }
  document.documentElement.classList.remove('drop-target');
});

addEventListener('drop', async (e) => {
  if (document.documentElement.classList.contains('visualizing')) {
    return;
  }
  e.preventDefault();
  document.documentElement.classList.remove('drop-target');

  const dataTransfer = e.dataTransfer;
  if (!dataTransfer) {
    return;
  }

  const files = dataTransfer.files;

  createLoadingSongPlaceholders(playlistSongsContainer, files.length);

  for (const file of files) {
    const { artist, album, title } = await guessSongInfo(file);
    await importSongFromFile(file, title, artist, album);
  }

  await startApp();
});

// Start the app.
startApp();
