const SHORTCUTS = [{
  key: 'n',
  action: player => player.playNext()
}, {
  key: 'p',
  action: player => player.playPrevious()
}, {
  key: ' ',
  action: player => {
    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }
}, {
  key: 'v',
  action: (_, toggleVisualizer) => toggleVisualizer()
}];

function getShortcut(key) {
  return SHORTCUTS.find(shortcut => shortcut.key === key);
}

export function initKeyboardShortcuts(player, toggleVisualizer) {
  addEventListener('keydown', e => {
    // If space was used but a button was focused, we're only
    // activating the button, not executing a shortcut.
    if (e.key === ' ' && e.target.tagName.toLowerCase() === 'button') {
      return;
    }

    const shortcut = getShortcut(e.key);
    if (shortcut) {
      shortcut.action(player, toggleVisualizer);
    } 
  });
}
