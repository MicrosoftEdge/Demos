import styles from "./theme-selector.css" assert { type: "css" };
import COLORS from "./themes.json" assert { type: "json" };

const selectMenuSupported = window.HTMLSelectMenuElement != null;
const eyeDropperSupported = 'EyeDropper' in window;

class ThemeSelector extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.selectMenu = document.createElement(selectMenuSupported ? 'selectmenu' : 'select');

    const button = document.createElement('button');
    button.setAttribute('slot', 'button');
    button.setAttribute('behavior', 'button');
    this.selectMenu.appendChild(button);

    for (const name in COLORS) {
      const option = createOption(name, COLORS[name]);
      this.selectMenu.appendChild(option);
    }

    if (eyeDropperSupported) {
      this.starOption = createStarOption();
      this.selectMenu.appendChild(this.starOption);
    }

    this.shadowRoot.appendChild(this.selectMenu);
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.selectMenu.addEventListener('input', () => {
      const name = this.selectMenu.value;
      if (name === 'star') {
        return;
      }

      this.dispatchEvent(new CustomEvent("theme-selected", {
        detail: { name, theme: COLORS[name] }
      }));
    });

    if (this.starOption) {
      this.starOption.addEventListener('click', async () => {
        const theme = await pickColorAndGenerateTheme();

        this.dispatchEvent(new CustomEvent("theme-selected", {
          detail: { name: 'star', theme }
        }));
      });
    }
  }
}

customElements.define("theme-selector", ThemeSelector);

function createOption(name, colors) {
  const option = document.createElement('option');
  option.value = name;

  if (selectMenuSupported) {
    const theme = document.createElement('div');
    theme.classList.add('theme');
    theme.style = `--text:${colors.text};--background:${colors.background};--highlight-background:${colors['highlight-background']};`;
    option.appendChild(theme);
  } else {
    option.textContent = name;
  }

  return option;
}

function createStarOption() {
  const option = document.createElement('option');
  option.value = 'star';

  const star = document.createElement('div');
  star.classList.add('star');
  star.innerHTML = `
    <svg version="1.1" viewBox="120 120 500 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="a">
          <path d="m141 147h471.79v451h-471.79z"/>
        </clipPath>
      </defs>
      <g clip-path="url(#a)">
        <path fill="gold" stroke="black" d="m154.29 350.75 91.641 66.578c10.473 7.6016 14.859 21.082 10.867 33.391l-35.023 107.75c-8.9375 27.523 22.566 50.418 45.996 33.41l91.641-66.586c10.473-7.6133 24.637-7.6133 35.109 0l91.641 66.586c23.418 17.008 54.93-5.8867 45.996-33.41l-35.008-107.75c-4.0117-12.309 0.375-25.785 10.855-33.391l91.629-66.578c23.41-17.02 11.391-54.055-17.555-54.055h-113.28c-12.938 0-24.434-8.3359-28.422-20.645l-34.996-107.72c-8.9453-27.547-47.883-27.547-56.84 0l-35.02 107.72c-3.9883 12.309-15.441 20.645-28.398 20.645h-113.28c-28.945 0-40.965 37.039-17.555 54.051z"/>
      </g>
    </svg>
  `;

  option.appendChild(star);

  return option;
}

async function pickColorAndGenerateTheme() {
  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();

    // The user selected a pixel, here is its color.
    const background = result.sRGBHex;

    // Get the right text color for this background color.
    const text = getContrastYIQ(background);

    // Generate 2 contrasting colors for the highlight background and link colors.
    const { c1, c2 } = getSplitComplementary(background);

    return {
      background,
      text,
      "highlight-background": c1,
      "highlight-text": getContrastYIQ(c1),
      "link": c2,
    }
  } catch (err) {
    return {};
  }
}

function getContrastYIQ(hexcolor) {
  var r = parseInt(hexcolor.substr(1, 2), 16);
  var g = parseInt(hexcolor.substr(3, 2), 16);
  var b = parseInt(hexcolor.substr(5, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

function getSplitComplementary(hexcolor) {
  const { h, s, l } = hexToHsl(hexcolor);
  const c1 = { h: absH(h - 150), s, l: offsetL(l) };
  const c2 = { h: absH(h + 150), s, l: offsetL(l) };

  return { c1: hslToHex(c1), c2: hslToHex(c2) };
}

function hslToHex({ h, s, l }) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  h = absH(h);

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

function absH(h) {
  return h < 0 ? h + 360 : h;
}

function offsetL(l) {
  return l < 50 ? l + 35 : l - 35;
}
