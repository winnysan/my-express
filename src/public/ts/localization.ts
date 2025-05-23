type Locale = 'en' | 'sk'

window.localization = {
  locale: (document.documentElement.lang as Locale) || 'en',
  dictionaries: {
    en: {
      scriptLoadedSuccessfully: 'Script loaded successfully',
      error: 'Error',
      appElementNotFound: 'App element not found',
      somethingWentWrong: 'Something went wrong',
      addFirst: 'Add first',
      add: 'Add',
      addNested: 'Add nested',
      delete: 'Delete',
      up: 'Up',
      down: 'Down',
      new: 'New',
      categoryDeleteConfirm: 'Are you sure you want to delete this category and all its subcategories?',
      postDeleteConfirm: 'Are you sure you want to delete this post?',
      en: 'English',
      sk: 'Slovak',
    },
    sk: {
      scriptLoadedSuccessfully: 'Script úspešne načítaný',
      error: 'Chyba',
      appElementNotFound: 'App element sa nenašiel',
      somethingWentWrong: 'Niečo sa pokazilo',
      add: 'Pridať',
      addFirst: 'Pridať prvú',
      addNested: 'Vložiť',
      delete: 'Vymazať',
      up: 'Hore',
      down: 'Dole',
      new: 'Nová',
      categoryDeleteConfirm: 'Naozaj chcete odstrániť kategoriu vrátane všetkých podkategorii?',
      postDeleteConfirm: 'Naozaj chcete odstrániť príspevok?',
      en: 'Anglicky',
      sk: 'Slovensky',
    },
  },
  getLocalizedText: function (key) {
    const dictionary = this.dictionaries[this.locale as Locale] || this.dictionaries['en']
    return dictionary[key]
  },
}
