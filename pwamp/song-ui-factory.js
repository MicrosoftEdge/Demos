import { getUniqueId } from "./utils.js";

export function removeAllSongs(playlistSongsContainer) {
  playlistSongsContainer.innerHTML = '';
}

export function createSongUI(playlistSongsContainer, song) {
  const li = document.createElement("li");
  li.classList.add('playlist-song');
  li.id = song.id;

  // Play button
  const playButton = document.createElement("button");
  playButton.classList.add('play');
  playButton.setAttribute('title', 'Play this song');
  playButton.innerHTML = '<span>Play</span>';
  li.appendChild(playButton);

  // Song title
  const titleInput = document.createElement("input");
  titleInput.classList.add('title');
  titleInput.setAttribute('type', 'text');
  titleInput.setAttribute('aria-label', 'Title');
  titleInput.setAttribute('title', 'Click to edit');
  titleInput.value = song.title;
  li.appendChild(titleInput);

  // Artist name
  const artistInput = document.createElement("input");
  artistInput.classList.add('artist');
  artistInput.setAttribute('type', 'text');
  artistInput.setAttribute('aria-label', 'Artist');
  artistInput.setAttribute('title', 'Click to edit');
  artistInput.value = song.artist;
  li.appendChild(artistInput);

  // Album name
  const albumInput = document.createElement("input");
  albumInput.classList.add('album');
  albumInput.setAttribute('type', 'text');
  albumInput.setAttribute('aria-label', 'Album');
  albumInput.setAttribute('title', 'Click to edit');
  albumInput.value = song.album;
  li.appendChild(albumInput);

  // Duration label
  const durationLabel = document.createElement("time");
  durationLabel.classList.add('duration');
  durationLabel.textContent = song.duration;
  li.appendChild(durationLabel);

  // Actions button
  const actionsButton = document.createElement("button");
  actionsButton.classList.add('actions');
  actionsButton.setAttribute('title', 'Song actions');
  actionsButton.innerHTML = '<span>Actions</span>';
  li.appendChild(actionsButton);

  playlistSongsContainer.appendChild(li);

  // Play button event listener
  playButton.addEventListener('click', () => {
    li.dispatchEvent(new CustomEvent("play-song", { bubbles: true }));
  });

  // Song details change listener
  function handleDetailsEdit() {
    li.dispatchEvent(new CustomEvent("edit-song", {
      detail: {
        artist: this.artistInput.value,
        album: this.albumInput.value,
        title: this.titleInput.value
      }
    }));
  }
  titleInput.addEventListener('change', handleDetailsEdit);
  artistInput.addEventListener('change', handleDetailsEdit);
  albumInput.addEventListener('change', handleDetailsEdit);

  // Actions button event listener
  actionsButton.addEventListener('click', () => {
    const anchorID = getUniqueId();
    actionsButton.id = anchorID;
    li.dispatchEvent(new CustomEvent("show-actions", {
      bubbles: true,
      detail: { anchorID, x: actionsButton.offsetLeft, y: actionsButton.offsetTop + actionsButton.offsetHeight }
    }));
  });

  return li;
}

export function createLoadingSongPlaceholders(playlistSongsContainer, nbOfPlaceholders) {
  for (let i = 0; i < nbOfPlaceholders; i++) {
    const playlistSongEl = createSongUI(playlistSongsContainer, { title: '', artist: '', album: '' });
    playlistSongEl.classList.add('loading-placeholder');
    playlistSongsContainer.appendChild(playlistSongEl);
  }
}

export function removeLoadingSongPlaceholders(playlistSongsContainer) {
  playlistSongsContainer.querySelectorAll('.loading-placeholder').forEach(li => {
    li.remove();
  });
}
