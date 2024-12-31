import Helper from './Helper'

/**
 * Bootstrap class responsible for initializing various components and handling UI interactions
 */
class Bootstrap {
  static initialize(): void {
    /**
     * Navigation elements
     */
    const hamburgerButtonEl =
      Helper.selectElement<HTMLButtonElement>('#hamburger')
    const navigationEl = Helper.selectElement<HTMLUListElement>('.navigation')
    const headerOverlayEl =
      Helper.selectElement<HTMLDivElement>('#header-overlay')

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

    /**
     * The current year in the footer
     */
    const yearEl = Helper.selectElement<HTMLSpanElement>('#year')
    if (yearEl) yearEl.innerText = String(new Date().getFullYear())
  }
}

export default Bootstrap
