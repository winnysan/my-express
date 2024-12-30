type Locale = 'en' | 'sk'

window.localization = {
  locale: (document.documentElement.lang as Locale) || 'en',
  dictionaries: {
    en: {
      helloFromConsoleE: 'Hello from console!',
      error: 'Error',
      appElementNotFound: 'App element not found',
    },
    sk: {
      helloFromConsoleE: 'Ahoj z konzole!',
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
