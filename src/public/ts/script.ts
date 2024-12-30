import './localization'

console.log(
  `%c${window.localization.getLocalizedText('helloFromConsoleE')}`,
  'color: white; background-color: green; font-weight: bold; padding: 2px 4px; border-radius: 3px;'
)

const dateEl: HTMLElement | null = document.querySelector('#date')

if (dateEl) dateEl.innerText = new Date().toLocaleDateString()
