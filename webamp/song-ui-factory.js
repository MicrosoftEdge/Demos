export function removeAllSongs(playlistSongsContainer) {
  playlistSongsContainer.innerHTML = '';
}

export function createSongUI(playlistSongsContainer, song) {
  const li = document.createElement("li");

  const playlistSongEl = document.createElement("playlist-song");
  playlistSongEl.setAttribute("artist", song.artist);
  playlistSongEl.setAttribute("album", song.album);
  playlistSongEl.setAttribute("title", song.title);
  playlistSongEl.setAttribute("duration", song.duration);
  playlistSongEl.setAttribute("id", song.id);

  li.appendChild(playlistSongEl);
  playlistSongsContainer.appendChild(li);

  return playlistSongEl;
}

export function createLoadingSongPlaceholders(playlistSongsContainer, nbOfPlaceholders) {
  for (let i = 0; i < nbOfPlaceholders; i++) {
    const li = document.createElement("li");
    li.classList.add('loading-placeholder');
    li.setAttribute('exportparts', 'artist, album, title');

    const playlistSongEl = document.createElement("playlist-song");
    li.appendChild(playlistSongEl);

    playlistSongsContainer.appendChild(li);
  }
}

export function removeLoadingSongPlaceholders(playlistSongsContainer) {
  playlistSongsContainer.querySelectorAll('.loading-placeholder').forEach(li => {
    li.remove();
  });
}
