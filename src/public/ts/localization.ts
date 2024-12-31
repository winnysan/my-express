type Locale = 'en' | 'sk'

window.localization = {
  locale: (document.documentElement.lang as Locale) || 'en',
  dictionaries: {
    en: {
      scriptLoadedSuccessfully: 'Script loaded successfully',
      error: 'Error',
      appElementNotFound: 'App element not found',
    },
    sk: {
      scriptLoadedSuccessfully: 'Script úspešne načítaný',
      error: 'Chyba',
      appElementNotFound: 'App element sa nenašiel',
    },
  },
  getLocalizedText: function (key) {
    const dictionary =
      this.dictionaries[this.locale as Locale] || this.dictionaries['en']
    return dictionary[key]
  },
}
