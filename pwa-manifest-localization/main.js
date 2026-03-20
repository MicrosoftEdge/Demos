const SUPPORTED_LANGUAGES = ["en", "de", "ar", "fr"];
const DEFAULT_LANGUAGE = "en";

// Register the service worker.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Detect the preferred language.
function getPreferredLanguage() {
  const preferredLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const locale of preferredLanguages) {
    const normalized = locale.toLowerCase();

    if (SUPPORTED_LANGUAGES.includes(normalized)) {
      return normalized;
    }

    const baseLanguage = normalized.split("-")[0];
    if (SUPPORTED_LANGUAGES.includes(baseLanguage)) {
      return baseLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
}

const currentLanguage = getPreferredLanguage();

if (currentLanguage !== DEFAULT_LANGUAGE) {
  // Set the document's language and direction.
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  // Switch the image.
  const image = document.querySelector("img");
  image.src = `./icons/localized_icons/${currentLanguage}/icon-128.png`;

  // Localize all elements with data-loc attributes.
  fetch('./translations.json')
    .then(response => response.json())
    .then(translations => {
      const localizedStrings = translations[currentLanguage];
      document.querySelectorAll('[data-loc]').forEach(element => {
        const locKey = element.getAttribute('data-loc');
        if (localizedStrings[locKey]) {
          element.innerHTML = localizedStrings[locKey];
        }
      });
    })
    .catch(error => {
      console.error('Error loading translations:', error);
    });
}
