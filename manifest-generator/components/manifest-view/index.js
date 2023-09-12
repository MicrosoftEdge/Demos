import JSONView from "./json.js";

const json = {
  name: "manifest-generator",
  short_name: "manifest-generator",
  start_url: "/",
  display: "standalone",
  background_color: "#fff",
  theme_color: "#fff",
  description: "A simple tool to generate a web app manifest",
  icons: [
    {
      src: "https://manifest-gen.now.sh/static/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "https://manifest-gen.now.sh/static/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};

// create a web component
class ManifestView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles/defaults.css" />
      <style>
        .manifest-view {
          padding: 1rem;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
      </style>
      <div class="manifest-view">
        <h2>Manifest</h2>
        <json-view json="${encodeURIComponent(
          JSON.stringify(json)
        )}"></json-view>
      </div>
    `;
  }
}

// create a web component
customElements.define("manifest-view", ManifestView);

// export to use in other files
export default ManifestView;
