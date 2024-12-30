interface Dictionary {
  helloFromConsoleE: string
  error: string
  appElementNotFound: string
}

interface Localization {
  locale: Locale
  dictionaries: {
    en: Dictionary
    sk: Dictionary
  }
  getLocalizedText: (key: keyof Dictionary) => string
}

interface Window {
  localization: Localization
}
