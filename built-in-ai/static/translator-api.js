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
  'ce': 'Chechen',
  'ceb': 'Cebuano',
  'cs': 'Czech',
  'cv': 'Chuvash',
  'cy': 'Welsh',
  'da': 'Danish',
  'de': 'German',
  'doi': 'Dogri',
  'dsb': 'Lower Sorbian',
  'dv': 'Divehi',
  'dzo': 'Dzongkha',
  'el': 'Greek',
  'en': 'English',
  'es': 'Spanish',
  'et': 'Estonian',
  'eu': 'Basque',
  'fa': 'Persian',
  'fi': 'Finnish',
  'fil': 'Filipino',
  'fj': 'Fijian',
  'fo': 'Faroese',
  'fr-ca': 'French (Canada)',
  'fr': 'French',
  'ga': 'Irish',
  'gl': 'Galician',
  'gom': 'Konkani',
  'gu': 'Gujarati',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hne': 'Chhattisgarhi',
  'hr': 'Croatian',
  'hsb': 'Upper Sorbian',
  'ht': 'Haitian Creole',
  'hu': 'Hungarian',
  'hy': 'Armenian',
  'id': 'Indonesian',
  'ig': 'Igbo',
  'ikt': 'Inuinnaqtun',
  'is': 'Icelandic',
  'it': 'Italian',
  'iu-latn': 'Inuktitut (Latin)',
  'iu': 'Inuktitut',
  'ja': 'Japanese',
  'jv': 'basa Djawa',
  'ka': 'Georgian',
  'kha': 'Khasi',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'kmr': 'Kurdish (Northern)',
  'kn': 'Kannada',
  'ko': 'Korean',
  'ks': 'Kashmiri',
  'ku': 'Kurdish (Central)',
  'ky': 'Kyrgyz',
  'la': 'Latin',
  'lb': 'Luxembourgish',
  'ln': 'Lingala',
  'lo': 'Lao',
  'lt': 'Lithuanian',
  'lug': 'Ganda',
  'luo': 'Dholuo',
  'lus': 'Mizo',
  'lv': 'Latvian',
  'lzh': 'Chinese (Literary)',
  'mag': 'Magahi',
  'mai': 'Maithili',
  'mg': 'Malagasy',
  'mi': 'Māori',
  'mk': 'Macedonian',
  'ml': 'Malayalam',
  'mn-cyrl': 'Mongolian (Cyrillic)',
  'mn-mong': 'Mongolian (Traditional)',
  'mni': 'Manipuri',
  'mr': 'Marathi',
  'ms': 'Malay',
  'mt': 'Maltese',
  'mww': 'Hmong Daw',
  'my': 'Myanmar (Burmese)',
  'nb': 'Norwegian',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'nso': 'Sesotho sa Leboa',
  'nya': 'Nyanja',
  'oc': 'Occitan',
  'or': 'Odia',
  'otq': 'Querétaro Otomi',
  'pa': 'Punjabi',
  'pl': 'Polish',
  'prs': 'Dari',
  'ps': 'Pashto',
  'pt-pt': 'Portuguese (Portugal)',
  'pt': 'Portuguese (Brazil)',
  'ro': 'Romanian',
  'ru': 'Russian',
  'run': 'Rundi',
  'rw': 'Kinyarwanda',
  'sa': 'Sanskrit',
  'sat': 'Santali',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sm': 'Samoan',
  'sn': 'Shona',
  'so': 'Somali',
  'sq': 'Albanian',
  'sr-cyrl': 'Serbian (Cyrillic)',
  'sr-latn': 'Serbian (Latin)',
  'st': 'Sesotho',
  'su': 'Sundanese',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ta': 'Tamil',
  'te': 'Telugu',
  'tet': 'Tetum',
  'tg': 'Tajik',
  'th': 'Thai',
  'ti': 'Tigrinya',
  'tk': 'Turkmen',
  'tlh-latn': 'Klingon (Latin)',
  'tn': 'Setswana',
  'to': 'Tongan',
  'tr': 'Turkish',
  'tt': 'Tatar',
  'ty': 'Tahitian',
  'ug': 'Uyghur',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek (Latin)',
  'vi': 'Vietnamese',
  'xh': 'Xhosa',
  'yo': 'Yoruba',
  'yua': 'Yucatec Maya',
  'yue': 'Cantonese (Traditional)',
  'zh-hans': 'Chinese Simplified',
  'zh-hant': 'Chinese Traditional',
  'zu': 'Zulu'
};

const DEFAULT_SOURCE_LANGUAGE = 'en';
const DEFAULT_TARGET_LANGUAGE = 'es';

sourceLanguageEl.innerHTML = Object.entries(LANGUAGE_NAMES).map(([code, name]) => {
  return `<option value="${code}"${code === DEFAULT_SOURCE_LANGUAGE ? " selected" : ""}>${name}</option>`;
}).join("\n");

targetLanguageEl.innerHTML = Object.entries(LANGUAGE_NAMES).map(([code, name]) => {
  return `<option value="${code}"${code === DEFAULT_TARGET_LANGUAGE ? " selected" : ""}>${name}</option>`;
}).join("\n");

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
