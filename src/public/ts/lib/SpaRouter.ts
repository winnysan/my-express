import Helper from './Helper'

/**
 * SpaRouter class responsible for handling SPA navigation
 */
class SpaRouter {
  private static bootstrap?: () => void
  private static toastEl: HTMLUListElement | undefined

  /**
   * Initializes a new instance of the SPA router
   * @param bootstrap
   */
  constructor(bootstrap?: () => void) {
    SpaRouter.bootstrap = bootstrap
    SpaRouter.toastEl = Helper.makeToast('#toast')
    this.initialize()
  }

  /**
   * Navigates to a new URL without reloading the entire page
   * @param url
   */
  public static navigateTo(url: string): void {
    const loadingIndicator = Helper.selectElement<HTMLDivElement>('#loading-indicator')
    if (loadingIndicator) loadingIndicator.style.display = 'block'

    SpaRouter.loadPage(url, true)
      .catch((err: Error) => {
        /**
         * Log any unexpected errors
         */
        console.error(err)

        Helper.addToastMessage(SpaRouter.toastEl, window.localization.getLocalizedText('somethingWentWrong'), 'danger')
      })
      .finally(() => {
        if (loadingIndicator) loadingIndicator.style.display = 'none'
      })
  }

  /**
   * Loads a page via AJAX and updates the content
   * @param url
   * @param updateHistory
   */
  private static async loadPage(url: string, updateHistory: boolean): Promise<void> {
    return await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((response: Response) => {
        if (!response.ok) {
          if (response.status === 404) return response.text()

          throw new Error(response.statusText)
        }

        return response.text()
      })
      .then((html: string) => {
        const appElement = Helper.selectElement<HTMLDivElement>('#app')

        if (appElement) {
          appElement.innerHTML = html

          const mainTitleRegex = /<main[^>]*data-title="([^"]*)"[^>]*>/i
          const match = mainTitleRegex.exec(html)

          if (match && match[1]) {
            document.title = match[1]
          } else {
            document.title = ''
          }
        } else {
          throw new Error(window.localization.getLocalizedText('appElementNotFound'))
        }

        if (updateHistory) {
          history.pushState(null, '', url)
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })

        /**
         * Initializes bootstrap after navigation
         */
        if (SpaRouter.bootstrap) {
          SpaRouter.bootstrap()
        }
      })
  }

  /**
   * Initialize SPA router
   */
  private initialize(): void {
    /**
     * Event listener for link clicks with the `data-link` attribute
     */
    document.body.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('[data-link]')

      if (link && link.matches('[data-link]')) {
        e.preventDefault()
        const href = link.getAttribute('href')

        if (href) SpaRouter.navigateTo(href)
      }
    })

    /**
     * Event listener for `popstate` events
     */
    window.addEventListener('popstate', () => {
      const url = location.pathname + location.search

      SpaRouter.loadPage(url, false).catch((err: Error) => {
        /**
         * Log any unexpected errors
         */
        console.error(err)

        Helper.addToastMessage(SpaRouter.toastEl, window.localization.getLocalizedText('somethingWentWrong'), 'danger')
      })
    })

    /**
     * Bootstrap initialization on first load
     */
    if (SpaRouter.bootstrap) {
      SpaRouter.bootstrap()
    }
  }
}

export default SpaRouter
