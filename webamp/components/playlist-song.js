import { getUniqueId } from "../utils.js";
import styles from "./playlist-song.css" assert { type: "css" };

const template = document.createElement('template');
template.innerHTML = `
<button class="play" part="play"><span>Play</span></button>
<input type="text" class="artist" aria-label="Artist" part="artist" title="Click to edit">
<input type="text" class="album" aria-label="Album" part="album" title="Click to edit">
<input type="text" class="title" aria-label="Title" part="title" title="Click to edit">
<time class="duration" part="duration"></time>
<button class="actions" part="actions" title="Song actions"><span>Actions</span></button>
`;

class PlaylistSong extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [styles];

    this.playButton = this.shadowRoot.querySelector('.play');
    this.artistInput = this.shadowRoot.querySelector('.artist');
    this.albumInput = this.shadowRoot.querySelector('.album');
    this.titleInput = this.shadowRoot.querySelector('.title');
    this.durationLabel = this.shadowRoot.querySelector('.duration');
    this.actionsButton = this.shadowRoot.querySelector('.actions');
  }

  connectedCallback() {
    this.artistInput.value = this.getAttribute('artist');
    this.albumInput.value = this.getAttribute('album');
    this.titleInput.value = this.getAttribute('title');
    this.durationLabel.textContent = this.getAttribute('duration');

    this.playButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent("play-song", { bubbles: true }));
    });

    this.artistInput.addEventListener('change', () => this.handleDetailsEdit());
    this.albumInput.addEventListener('change', () => this.handleDetailsEdit());
    this.titleInput.addEventListener('change', () => this.handleDetailsEdit());

    this.actionsButton.addEventListener('click', () => {
      const anchorID = getUniqueId();
      this.actionsButton.id = anchorID;
      this.dispatchEvent(new CustomEvent("show-actions", {
        bubbles: true,
        detail: { anchorID, x: this.actionsButton.offsetLeft, y: this.actionsButton.offsetTop + this.actionsButton.offsetHeight }
      }));
    });
  }

  handleDetailsEdit() {
    this.dispatchEvent(new CustomEvent("edit-song", {
      detail: {
        artist: this.artistInput.value,
        album: this.albumInput.value,
        title: this.titleInput.value
      }
    }));
  }
}

customElements.define("playlist-song", PlaylistSong);
