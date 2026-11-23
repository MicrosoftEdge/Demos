// Catalog data. Every entry carries explicit legal and install status.
//
// legalStatus:   'pending' | 'approved' | 'rejected'   (CELA guidance is unresolved)
// installStatus: 'verified'         -> manifest and ID already used by working install demos in this repo
//                'manifest-checked' -> manifest fetched, `id` member present; not yet tested in a target Edge build
//                'no-manifest-id'   -> no known computed ID yet, so install is not offered (visit only)
//                'blocked-mime-type'-> manifest isn't served with a JSON Content-Type, so install is not offered
// When a manifest has no `id`, the computed ID is its start_url (fragment removed).
//
// Only 'verified' and 'manifest-checked' entries get install controls.
// `manifestId` is the computed app ID (Application > Manifest > Identity), never guessed.

export const CATEGORIES = ['Productivity', 'Creativity', 'Communication', 'Entertainment'];

const DEMOS = 'https://microsoftedge.github.io/Demos';

export const APPS = [
  {
    id: 'pwamp',
    name: 'PWAmp',
    category: 'Entertainment',
    summary: 'Play your local music files in a web-based player.',
    description: 'PWAmp is a music player PWA demo that plays audio files stored on your device.',
    useCases: ['Play a folder of local tracks', 'Try a media player as an installed app'],
    websiteUrl: `${DEMOS}/pwamp/`,
    manifestUrl: `${DEMOS}/pwamp/manifest.json`,
    manifestId: `${DEMOS}/pwamp/`,
    legalStatus: 'approved',
    installStatus: 'verified',
    checkedOn: '2026-11-16',
    notes: 'Microsoft-owned demo; target used by pwa-install-element and pwa-install-api.',
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    category: 'Creativity',
    summary: 'Sketch diagrams that have a hand-drawn feel.',
    description:
      'Excalidraw is a virtual whiteboard for sketching diagrams, wireframes and ideas, with a deliberately hand-drawn look.',
    useCases: ['Sketch a quick architecture diagram', 'Draw a wireframe', 'Brainstorm on a shared canvas'],
    websiteUrl: 'https://excalidraw.com/',
    manifestUrl: 'https://excalidraw.com/manifest.webmanifest',
    manifestId: 'https://excalidraw.com/excalidraw',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest has id "excalidraw" but sends a restrictive Access-Control-Allow-Origin header; confirm cross-origin install in Edge.',
  },
  {
    id: 'photopea',
    name: 'Photopea',
    category: 'Creativity',
    summary: 'Edit images and PSD files in your browser.',
    description: 'Photopea is an image editor that opens and edits layered files such as PSD, as well as common image formats.',
    useCases: ['Touch up a photo', 'Open a PSD without desktop software', 'Convert between image formats'],
    websiteUrl: 'https://www.photopea.com/',
    manifestUrl: 'https://www.photopea.com/manifest.json',
    manifestId: 'https://www.photopea.com/',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest has no `id`; computed ID is the resolved start_url ("/").',
  },
  {
    id: 'mastodon',
    name: 'Mastodon',
    category: 'Communication',
    summary: 'Follow people and share updates on a decentralized network.',
    description: 'Mastodon is a decentralized social network. This entry opens the mastodon.social server, one of many you can join.',
    useCases: ['Follow friends, creators and communities', 'Post short updates', 'Join a server that suits your interests'],
    websiteUrl: 'https://mastodon.social/',
    manifestUrl: 'https://mastodon.social/manifest',
    manifestId: 'https://mastodon.social/home',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest `id` is "/home", which resolves to the computed ID above. Icon URLs contain build hashes and may change.',
  },
  {
    id: 'jspaint',
    name: 'JS Paint',
    category: 'Entertainment',
    summary: 'A nostalgic paint program, rebuilt for the web.',
    description: 'JS Paint is a faithful web recreation of a classic desktop paint program.',
    useCases: ['Doodle for fun', 'Revisit a classic painting tool'],
    websiteUrl: 'https://jspaint.app/',
    manifestUrl: 'https://jspaint.app/manifest.webmanifest',
    manifestId: 'https://jspaint.app/',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest has no `id`; computed ID is start_url "." resolved against the manifest URL.',
  },
  {
    id: 'telegram-web',
    name: 'Telegram Web',
    category: 'Communication',
    summary: 'Fast messaging with chats, channels and shared files.',
    description: 'Telegram Web is the browser version of the Telegram messenger, with private chats, group chats and channels.',
    useCases: ['Message contacts from your computer', 'Follow channels', 'Share files between devices'],
    websiteUrl: 'https://web.telegram.org/a/',
    manifestUrl: 'https://web.telegram.org/a/site.webmanifest',
    manifestId: 'https://web.telegram.org/a/',
    legalStatus: 'pending',
    installStatus: 'blocked-mime-type',
    checkedOn: '2026-11-16',
    notes: 'Manifest `id` is "/a/" (computed ID https://web.telegram.org/a/), but the manifest is served as application/octet-stream and the guide requires a JSON Content-Type, so install is expected to fail with DataError. Re-enable if that changes.',
  },
  {
    id: 'tldraw',
    name: 'tldraw',
    category: 'Creativity',
    summary: 'A fast, minimal whiteboard for diagrams and notes.',
    description: 'tldraw is an infinite canvas for drawing, diagramming and sketching ideas.',
    useCases: ['Map out a user flow', 'Annotate screenshots', 'Doodle during a call'],
    websiteUrl: 'https://www.tldraw.com/',
    manifestUrl: 'https://www.tldraw.com/manifest.webmanifest',
    manifestId: 'https://www.tldraw.com/',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest has no `id`; computed ID is the resolved start_url ("/").',
  },
  {
    id: 'pwinter',
    name: 'The PWinter',
    category: 'Creativity',
    summary: 'Generate custom icons for your web app.',
    description: 'The PWinter is a PWA icon generator that helps you produce the icon set an installable web app needs.',
    useCases: ['Create app icons for a new PWA', 'Experiment with randomized icon styles'],
    websiteUrl: 'https://diek.us/pwinter',
    manifestUrl: 'https://diek.us/pwinter/manifest.json',
    manifestId: 'https://diek.us/pwinter/index.html?randomize=true',
    legalStatus: 'pending',
    installStatus: 'verified',
    checkedOn: '2026-11-16',
    notes: 'Same target as pwa-install-element and pwa-install-api demos.',
  },
  {
    id: '1div',
    name: '1DIV',
    category: 'Creativity',
    summary: 'A CSS art gallery drawn with a single div.',
    description: '1DIV is a playful Microsoft Edge demo showing what pure CSS can draw using a single HTML element.',
    useCases: ['Get inspired by CSS art', 'Learn how a single element can render complex images'],
    websiteUrl: `${DEMOS}/1DIV/dist/index.html`,
    manifestUrl: `${DEMOS}/1DIV/dist/manifest.json`,
    manifestId: `${DEMOS}/1DIV/dist/index.html`,
    legalStatus: 'approved',
    installStatus: 'verified',
    checkedOn: '2026-11-16',
    notes: 'Microsoft-owned demo; target used by pwa-install-api.',
  },
  {
    id: 'squoosh',
    name: 'Squoosh',
    category: 'Productivity',
    summary: 'Compress and compare images with different codecs.',
    description: 'Squoosh shrinks images right in your browser and lets you compare the results side by side.',
    useCases: ['Make a photo smaller for the web', 'Compare WebP and AVIF output'],
    websiteUrl: 'https://squoosh.app/',
    manifestUrl: 'https://squoosh.app/manifest.json',
    manifestId: 'https://squoosh.app/?utm_medium=PWA&utm_source=launcher',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest has no `id`; computed ID is the resolved start_url, including its query string.',
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    category: 'Productivity',
    summary: 'Graph functions and explore math visually.',
    description: 'Desmos offers an interactive graphing calculator for plotting equations and exploring how they behave.',
    useCases: ['Plot a function', 'Check homework visually', 'Explore sliders and parameters'],
    websiteUrl: 'https://www.desmos.com/calculator',
    manifestUrl: 'https://www.desmos.com/assets/pwa/app.webmanifest',
    manifestId: null,
    legalStatus: 'pending',
    installStatus: 'no-manifest-id',
    checkedOn: '2026-11-16',
    notes: 'Manifest has neither `id` nor `start_url`, so the computed ID depends on the document that links it. Read it from DevTools before enabling install.',
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    category: 'Productivity',
    summary: 'Convert between Celsius, Fahrenheit and Kelvin.',
    description: 'A small Microsoft Edge demo app that converts temperatures between units.',
    useCases: ['Check a recipe temperature', 'Convert a weather forecast'],
    websiteUrl: `${DEMOS}/temperature-converter/index.html`,
    manifestUrl: `${DEMOS}/temperature-converter/manifest.json`,
    manifestId: `${DEMOS}/temperature-converter/`,
    legalStatus: 'approved',
    installStatus: 'verified',
    checkedOn: '2026-11-16',
    notes: 'Microsoft-owned demo; target used by pwa-install-api.',
  },
  {
    id: 'pwa-timer',
    name: 'Timer',
    category: 'Productivity',
    summary: 'A simple timer that lives on your desktop.',
    description: 'A Microsoft Edge demo timer app that you can install and keep one click away.',
    useCases: ['Time a focus session', 'Keep an eye on the oven'],
    websiteUrl: `${DEMOS}/pwa-timer/`,
    manifestUrl: `${DEMOS}/pwa-timer/manifest.json`,
    manifestId: `${DEMOS}/pwa-timer/`,
    legalStatus: 'approved',
    installStatus: 'verified',
    checkedOn: '2026-11-16',
    notes: 'Microsoft-owned demo; target used by pwa-install-api.',
  },
  {
    id: 'element',
    name: 'Element',
    category: 'Communication',
    summary: 'Chat with friends and teams on the open Matrix network.',
    description: 'Element is a chat app for the Matrix network, with direct messages, group rooms, and voice and video calls.',
    useCases: ['Message friends and communities', 'Run a team chat on an open standard', 'Join a call from your desktop'],
    websiteUrl: 'https://app.element.io/',
    manifestUrl: 'https://app.element.io/manifest.json',
    manifestId: 'https://app.element.io/index.html',
    legalStatus: 'pending',
    installStatus: 'manifest-checked',
    checkedOn: '2026-11-16',
    notes: 'Manifest has no `id`; computed ID is start_url "index.html" resolved against the manifest URL.',
  },
];

const ICONS = {
  excalidraw: 'https://excalidraw.com/android-chrome-192x192.png',
  photopea: 'https://www.photopea.com/promo/icon512.png',
  tldraw: 'https://www.tldraw.com/android-chrome-512x512.png',
  pwinter: 'https://diek.us/pwinter/images/pwinter-512.png',
  '1div': `${DEMOS}/1DIV/dist/img/icon-256.png`,
  squoosh: 'https://squoosh.app/c/icon-large-cb438cac.png',
  desmos: 'https://www.desmos.com/assets/pwa/icon-512x512.png',
  'temperature-converter': `${DEMOS}/temperature-converter/icon512.png`,
  'pwa-timer': `${DEMOS}/pwa-timer/icon512.png`,
  element: 'https://app.element.io/vector-icons/512.png',
  'telegram-web': 'https://web.telegram.org/a/icon-192x192.png',
  mastodon: 'https://mastodon.social/packs/assets/android-chrome-192x192-jYKJbpas.png',
  pwamp: `${DEMOS}/pwamp/favicon-256.png`,
  jspaint: 'https://jspaint.app/images/icons/192x192.png',
};
for (const app of APPS) app.iconUrl = ICONS[app.id] ?? null;

export function isInstallable(app) {
  return (
    (app.installStatus === 'verified' || app.installStatus === 'manifest-checked') &&
    isSafeHttpsUrl(app.manifestUrl)
  );
}

export function isSafeHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function getApp(id) {
  return APPS.find((app) => app.id === id);
}
