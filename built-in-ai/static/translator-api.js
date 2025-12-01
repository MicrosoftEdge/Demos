const inputEl = document.querySelector("#input");
const sourceLanguageEl = document.querySelector("#source-language");
const targetLanguageEl = document.querySelector("#target-language");
const outputEl = document.querySelector("#output");
const translateBtn = document.querySelector("#translate");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

const LANGUAGE_NAMES = {
  'af': 'Afrikaans',
  'am': 'Amharic',
  'ar': 'Arabic',
  'as': 'Assamese',
  'awa': 'Awadhi',
  'az': 'Azerbaijani',
  'ba': 'Bashkir',
  'be': 'Belarusian',
  'bg': 'Bulgarian',
  'bho': 'Bhojpuri',
  'bn': 'Bangla',
  'bo': 'Tibetan',
  'brx': 'Bodo',
  'bs': 'Bosnian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ce': 'Chechen',
  'zh-hans': 'Chinese Simplified',
  'zh-hant': 'Chinese Traditional',
  'cv': 'Chuvash',
  'cs': 'Czech',
  'cy': 'Welsh',
  'da': 'Danish',
  'de': 'German',
  'doi': 'Dogri',
  'dv': 'Divehi',
  'dsb': 'Lower Sorbian',
  'dzo': 'Dzongkha',
  'el': 'Greek',
  'en': 'English',
  'es': 'Spanish',
  'et': 'Estonian',
  'eu': 'Basque',
  'fa': 'Persian',
  'fj': 'Fijian',
  'fil': 'Filipino',
  'fi': 'Finnish',
  'fo': 'Faroese',
  'fr': 'French',
  'fr-ca': 'French (Canada)',
  'gl': 'Galician',
  'gom': 'Konkani',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hne': 'Chhattisgarhi',
  'hr': 'Croatian',
  'hsb': 'Upper Sorbian',
  'hu': 'Hungarian',
  'hy': 'Armenian',
  'ig': 'Igbo',
  'ikt': 'Inuinnaqtun',
  'id': 'Indonesian',
  'ga': 'Irish',
  'is': 'Icelandic',
  'it': 'Italian',
  'iu-latn': 'Inuktitut (Latin)',
  'iu': 'Inuktitut',
  'jv': 'basa Djawa',
  'ja': 'Japanese',
  'ks': 'Kashmiri',
  'ka': 'Georgian',
  'kn': 'Kannada',
  'kha': 'Khasi',
  'km': 'Khmer',
  'rw': 'Kinyarwanda',
  'kk': 'Kazakh',
  'kmr': 'Kurdish (Northern)',
  'ko': 'Korean',
  'ku': 'Kurdish (Central)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lb': 'Luxembourgish',
  'ln': 'Lingala',
  'lt': 'Lithuanian',
  'lug': 'Ganda',
  'luo': 'Dholuo',
  'lus': 'Mizo',
  'lv': 'Latvian',
  'lzh': 'Chinese (Literary)',
  'mag': 'Magahi',
  'mai': 'Maithili',
  'mr': 'Marathi',
  'mk': 'Macedonian',
  'mg': 'Malagasy',
  'mt': 'Maltese',
  'mn-mong': 'Mongolian (Traditional)',
  'mni': 'Manipuri',
  'mn-cyrl': 'Mongolian (Cyrillic)',
  'mi': 'Māori',
  'ms': 'Malay',
  'mww': 'Hmong Daw',
  'my': 'Myanmar (Burmese)',
  'ml': 'Malayalam',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'nb': 'Norwegian',
  'nso': 'Sesotho sa Leboa',
  'nya': 'Nyanja',
  'oc': 'Occitan',
  'or': 'Odia',
  'otq': 'Querétaro Otomi',
  'pa': 'Punjabi',
  'ps': 'Pashto',
  'pl': 'Polish',
  'prs': 'Dari',
  'pt': 'Portuguese (Brazil)',
  'pt-pt': 'Portuguese (Portugal)',
  'ro': 'Romanian',
  'run': 'Rundi',
  'ru': 'Russian',
  'sa': 'Sanskrit',
  'sat': 'Santali',
  'si': 'Sinhala',
  'sd': 'Sindhi',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sm': 'Samoan',
  'sn': 'Shona',
  'so': 'Somali',
  'st': 'Sesotho',
  'sq': 'Albanian',
  'sr-latn': 'Serbian (Latin)',
  'sr-cyrl': 'Serbian (Cyrillic)',
  'su': 'Sundanese',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ty': 'Tahitian',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'te': 'Telugu',
  'tet': 'Tetum',
  'th': 'Thai',
  'ti': 'Tigrinya',
  'tlh-latn': 'Klingon (Latin)',
  'to': 'Tongan',
  'tr': 'Turkish',
  'tn': 'Setswana',
  'tt': 'Tatar',
  'tk': 'Turkmen',
  'ug': 'Uyghur',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek (Latin)',
  'vi': 'Vietnamese',
  'xh': 'Xhosa',
  'yo': 'Yoruba',
  'yua': 'Yucatec Maya',
  'yue': 'Cantonese (Traditional)',
  'zu': 'Zulu'
};

const LANGUAGE_CATEGORIES = {
  'Core Languages': ['en'],
  'Germanic Languages': ['de', 'nl', 'da', 'nb', 'sv', 'af', 'is', 'fo', 'lb'],
  'Romance Languages': ['es', 'fr', 'it', 'pt', 'pt-pt', 'ca', 'ro', 'gl', 'oc', 'la'],
  'Latin Script Slavic': ['pl', 'cs', 'sk', 'hr', 'sl', 'bs', 'dsb', 'hsb', 'sr-latn'],
  'Cyrillic Script': ['ru', 'bg', 'uk', 'be', 'mk', 'sr-cyrl', 'kk', 'ky', 'tg', 'tt', 'mn-cyrl', 'ba', 'ce', 'cv'],
  'East Asian': ['zh-hans', 'zh-hant', 'ja', 'ko', 'lzh', 'yue'],
  'South Asian': ['hi', 'bn', 'gu', 'kn', 'ml', 'mr', 'ta', 'te', 'ur', 'as', 'or', 'pa', 'ne', 'si', 'my', 'dv', 'awa', 'bho', 'brx', 'doi', 'gom', 'hne', 'kha', 'lus', 'mag', 'mai', 'mni', 'sat'],
  'Southeast Asian': ['th', 'vi', 'id', 'ms', 'km', 'lo', 'jv', 'su', 'ceb', 'fil', 'mi', 'fj', 'haw', 'sm', 'to', 'ty', 'tet'],
  'Arabic Script': ['ar', 'fa', 'he', 'ps', 'prs', 'ku', 'ks', 'sd', 'ug'],
  'African Languages': ['ha', 'ig', 'yo', 'zu', 'xh', 'sw', 'sn', 'st', 'tn', 'nso', 'run', 'rw', 'ln', 'mg', 'so', 'am', 'ti', 'nya'],
  'Other European': ['fi', 'hu', 'et', 'lv', 'lt', 'el', 'mt', 'eu', 'cy', 'ga', 'sq', 'hy', 'ka', 'tr', 'az', 'uz', 'tk', 'kk', 'ky'],
  'Other': []
};

// Populate the Other category with any languages not already categorized.
for (const langCode in LANGUAGE_NAMES) {
  if (!Object.values(LANGUAGE_CATEGORIES).some(arr => arr.includes(langCode))) {
    LANGUAGE_CATEGORIES['Other'].push(langCode);
  }
}

const DEFAULT_SOURCE_LANGUAGE = 'en';
const DEFAULT_TARGET_LANGUAGE = 'zh-hans';

let sourceLanguageHTML = "";
let targetLanguageHTML = "";

for (const [category, languages] of Object.entries(LANGUAGE_CATEGORIES)) {
  sourceLanguageHTML += `<optgroup label="${category}">\n`;
  targetLanguageHTML += `<optgroup label="${category}">\n`;

  for (const code of languages) {
    const name = LANGUAGE_NAMES[code];
    sourceLanguageHTML += `  <option value="${code}"${code === DEFAULT_SOURCE_LANGUAGE ? " selected" : ""}>${name}</option>\n`;
    targetLanguageHTML += `  <option value="${code}"${code === DEFAULT_TARGET_LANGUAGE ? " selected" : ""}>${name}</option>\n`;
  }
  sourceLanguageHTML += `</optgroup>\n`;
  targetLanguageHTML += `</optgroup>\n`;
}

sourceLanguageEl.innerHTML = sourceLanguageHTML;
targetLanguageEl.innerHTML = targetLanguageHTML;

async function checkAvailabbility() {
  const sourceLanguage = sourceLanguageEl.value;
  const targetLanguage = targetLanguageEl.value;

  try {
    const avail = await checkTranslatorAPIAvailability({ sourceLanguage, targetLanguage });
    console.log(`The model for translating from ${sourceLanguage} to ${targetLanguage} is ${avail}.`);
  } catch (e) {
    displaySessionMessage(`The language pair ${sourceLanguage} to ${targetLanguage} is not supported.`, true);
  }
}

addEventListener("load", async () => {
  await checkAvailabbility();
  let session = null;

  let abortController

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the translation.");
    }
    abortController = null;
    session?.destroy();
    spinnerEl.remove();
  });

  translateBtn.addEventListener("click", async () => {
    if (inputEl.value === "") {
      return;
    }

    outputEl.textContent = "Translating ...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    const sourceLanguage = sourceLanguageEl.value;
    const targetLanguage = targetLanguageEl.value;
    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}.`);

    const metrics = new PlaygroundMetrics();
    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getTranslatorSession({
        sourceLanguage,
        targetLanguage
      });
    } catch (e) {
      displaySessionMessage(`Could not create the Translator session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      abortController = new AbortController();
      const stream = session.translateStreaming(inputEl.value, {
        signal: abortController.signal
      });

      metrics.signalOnBeforeStream();

      let isFirstChunk = true;
      for await (const chunk of stream) {
        if (isFirstChunk) {
          spinnerEl.remove();
          isFirstChunk = false;
          outputEl.textContent = "";
        }

        metrics.signalOnStreamChunk();

        outputEl.textContent += chunk;
      }
    } catch (e) {
      displaySessionMessage(`Could not translate the text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});

sourceLanguageEl.addEventListener("change", async () => {
  await checkAvailabbility();
});

targetLanguageEl.addEventListener("change", async () => {
  await checkAvailabbility();
});
