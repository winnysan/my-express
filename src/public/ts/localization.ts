type Locale = 'en' | 'sk'

window.localization = {
  locale: (document.documentElement.lang as Locale) || 'en',
  dictionaries: {
    en: {
      helloFromConsoleE: 'Hello from console!',
    },
    sk: {
      helloFromConsoleE: 'Ahoj z konzoly!',
    },
  },
  getLocalizedText: function (key) {
    const dictionary =
      this.dictionaries[this.locale as Locale] || this.dictionaries['en']
    return dictionary[key]
  },
}
