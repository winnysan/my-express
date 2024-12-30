import Helper from './lib/Helper'
import './localization'

console.log(
  `%c${window.localization.getLocalizedText('helloFromConsoleE')}`,
  'color: white; background-color: green; font-weight: bold; padding: 2px 4px; border-radius: 3px;'
)

/**
 * The current year in the footer
 */
const yearEl = Helper.selectElement<HTMLSpanElement>('#year')
if (yearEl) yearEl.innerText = String(new Date().getFullYear())

/**
 * Navigation elements
 */
const hamburgerButtonEl = Helper.selectElement<HTMLButtonElement>('#hamburger')
const navigationEl = Helper.selectElement<HTMLUListElement>('.navigation')
const headerOverlayEl = Helper.selectElement<HTMLDivElement>('#header-overlay')

/**
 * Mobile menu toggle
 */
hamburgerButtonEl?.addEventListener('click', () => {
  navigationEl?.classList.toggle('active')
  headerOverlayEl?.classList.toggle('active')
})

headerOverlayEl?.addEventListener('click', () => {
  navigationEl?.classList.remove('active')
  headerOverlayEl?.classList.remove('active')
})
