interface Dictionary {
  scriptLoadedSuccessfully: string
  error: string
  appElementNotFound: string
  somethingWentWrong: string
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
