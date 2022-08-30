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

  // Album artwork
  const albumArt = document.createElement("img");
  albumArt.classList.add('artwork');
  albumArt.setAttribute('loading', 'lazy');
  albumArt.setAttribute('src', './album-art-placeholder.png');
  li.appendChild(albumArt);

  // Song title
  const titleInput = document.createElement("span");
  titleInput.classList.add('title');
  titleInput.setAttribute('title', 'Song title - click to edit');
  titleInput.textContent = song.title;
  titleInput.setAttribute('contenteditable', true);
  titleInput.setAttribute('spellcheck', false);
  li.appendChild(titleInput);

  // Artist name
  const artistInput = document.createElement("span");
  artistInput.classList.add('artist');
  artistInput.setAttribute('title', 'Artist - click to edit');
  artistInput.textContent = song.artist;
  artistInput.setAttribute('contenteditable', true);
  artistInput.setAttribute('spellcheck', false);
  li.appendChild(artistInput);

  // Album name
  const albumInput = document.createElement("span");
  albumInput.classList.add('album');
  albumInput.setAttribute('title', 'Album - click to edit');
  albumInput.textContent = song.album;
  albumInput.setAttribute('contenteditable', true);
  albumInput.setAttribute('spellcheck', false);
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

  // Auto-select text on focus
  function focusText() {
    window.setTimeout(function () {
      const range = document.createRange();
      range.selectNodeContents(document.activeElement);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 1);
  }
  titleInput.addEventListener('focus', focusText);
  artistInput.addEventListener('focus', focusText);
  albumInput.addEventListener('focus', focusText);

  // Song details change listener
  function handleDetailsEdit() {
    li.dispatchEvent(new CustomEvent("edit-song", {
      detail: {
        artist: artistInput.textContent,
        album: albumInput.textContent,
        title: titleInput.textContent
      }
    }));
  }
  titleInput.addEventListener('input', handleDetailsEdit);
  artistInput.addEventListener('input', handleDetailsEdit);
  albumInput.addEventListener('input', handleDetailsEdit);

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
