type Locale = 'en' | 'sk'

window.localization = {
  locale: (document.documentElement.lang as Locale) || 'en',
  dictionaries: {
    en: {
      scriptLoadedSuccessfully: 'Script loaded successfully',
      error: 'Error',
      appElementNotFound: 'App element not found',
      somethingWentWrong: 'Something went wrong',
      add: 'Add',
      addNested: 'Add nested',
      delete: 'Delete',
      up: 'Up',
      down: 'Down',
    },
    sk: {
      scriptLoadedSuccessfully: 'Script úspešne načítaný',
      error: 'Chyba',
      appElementNotFound: 'App element sa nenašiel',
      somethingWentWrong: 'Niečo sa pokazilo',
      add: 'Pridať',
      addNested: 'Vložiť',
      delete: 'Vymazať',
      up: 'Hore',
      down: 'Dole',
    },
  },
  getLocalizedText: function (key) {
    const dictionary = this.dictionaries[this.locale as Locale] || this.dictionaries['en']
    return dictionary[key]
  },
}
