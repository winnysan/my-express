interface Dictionary {
  scriptLoadedSuccessfully: string
  error: string
  appElementNotFound: string
  somethingWentWrong: string
  add: string
  addFirst: string
  addNested: string
  delete: string
  up: string
  down: string
  new: string
  categoryDeleteConfirm: string
  postDeleteConfirm: string
  en: string
  sk: string
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
