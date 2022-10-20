import { getImageAsDataURI } from './utils.js';

export function initMediaSession(player) {
  if (!('mediaSession' in navigator)) {
    return;
  }

  function updateMediaSessionState() {
    navigator.mediaSession.playbackState = player.audio.paused ? 'paused' : 'playing';
    navigator.mediaSession.setPositionState({
      duration: player.audio.duration,
      position: player.audio.currentTime,
      playbackRate: player.audio.playbackRate
    });
  }

  async function updateMediaSessionMetadata() {
    const artworkUrl = player.song.artworkUrl
    ? await getImageAsDataURI(player.song.artworkUrl)
    : 'https://microsoftedge.github.io/Demos/pwamp/album-art-placeholder.png';

    const artwork = {
      src: artworkUrl,
      type: artworkUrl.substring(artworkUrl.indexOf(':') + 1, artworkUrl.indexOf(';')),
    };

    navigator.mediaSession.metadata = new MediaMetadata({
      title: player.song.title,
      artist: player.song.artist,
      album: player.song.album,
      artwork: [artwork]
    });
  }

  const actionHandlers = new Map([
    ['play', () => player.play()],
    ['pause', () => player.pause()],
    ['previoustrack', () => player.playPrevious()],
    ['nexttrack', () => player.playNext()],
    ['seekto', (e) => player.currentTime = e.seekTime]
  ]);

  for (const [action, handler] of actionHandlers) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (e) {
      console.log(`mediasession action ${action} not supported yet`)
    }
  }

  const audioEvents = ['playing', 'paused', 'durationchange', 'ratechange', 'timechange'];
  for (const event of audioEvents) {
    player.audio.addEventListener(event, updateMediaSessionState);
  }

  player.addEventListener('playing', updateMediaSessionMetadata);
}
