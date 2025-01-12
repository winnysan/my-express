import Helper from './Helper'
import SpaRouter from './SpaRouter'

/**
 * A class to handle filter form submission
 */
class FilterFormHandler {
  private filterFormEl: HTMLFormElement | null
  private multiValuesField?: string[]
  private toastEl?: HTMLUListElement
  private formData?: FormData
  private queryParams?: URLSearchParams
  private urlWithParams?: string

  /**
   * Initialize the FilterFormHandler
   * @param filterFormSelector
   * @param multiValuefield
   */
  constructor(filterFormSelector: string, multiValuefield?: string[]) {
    this.filterFormEl = Helper.selectElement<HTMLFormElement>(filterFormSelector)

    if (this.filterFormEl) {
      this.multiValuesField = multiValuefield
      this.toastEl = Helper.makeToast('#toast')
      this.initialize()
    }
  }

  /**
   * Sets up the event listener for the form submit event
   */
  private initialize() {
    this.filterFormEl?.addEventListener('submit', async (e: SubmitEvent) => {
      e.preventDefault()

      await this.handleSubmit()
    })
  }

  /**
   * Handles form submission by collecting form data
   */
  private async handleSubmit() {
    this.formData = new FormData(this.filterFormEl!)
    this.queryParams = new URLSearchParams()

    try {
      if (this.formData) {
        this.formData.forEach((value, key) => {
          if (!value) return

          if (this.multiValuesField?.includes(key)) {
            this.queryParams!.append(key, value as string)
          } else {
            this.queryParams!.set(key, value as string)
          }
        })
      }

      this.urlWithParams = `${this.filterFormEl!.action}?${this.queryParams.toString()}`

      SpaRouter.navigateTo(this.urlWithParams)
    } catch (err) {
      /**
       * Log any unexpected errors
       */
      console.error(err)

      Helper.addToastMessage(this.toastEl, window.localization.getLocalizedText('somethingWentWrong'), 'danger')
    }
  }
}

export default FilterFormHandler
