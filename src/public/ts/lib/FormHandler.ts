import Helper from './Helper'

/**
 * A class to handle form submission
 */
class FormHandler {
  private formEl: HTMLFormElement | null
  private toastEl: HTMLUListElement | undefined

  /**
   * Initialize the FormHandler
   * @param formSelector
   */
  constructor(formSelector: string) {
    this.formEl = Helper.selectElement<HTMLFormElement>(formSelector)

    if (this.formEl) {
      this.toastEl = Helper.makeToast('#toast')
      this.initialize()
    }
  }

  /**
   * Sets up the event listener for the form submit event
   */
  private initialize() {
    this.formEl?.addEventListener('submit', async (e: SubmitEvent) => {
      e.preventDefault()

      await this.handleSubmit()
    })
  }

  /**
   * Handles form submission by collecting form data
   */
  private async handleSubmit() {
    if (this.formEl) {
      const formData = new FormData(this.formEl)

      const loadingIndicator: HTMLDivElement | null =
        Helper.selectElement<HTMLDivElement>('#loading-indicator')

      try {
        if (loadingIndicator) loadingIndicator.style.display = 'block'

        const response = await fetch(this.formEl.action, {
          method: this.formEl.method,
          body: formData,
        })

        if (!response.ok) {
          /**
           * Handle non-OK responses
           */
          const result = await response.json()
          let message: string =
            window.localization.getLocalizedText('somethingWentWrong')

          if (result.error?.message) message = result.error.message

          Helper.addToastMessage(this.toastEl, message, 'danger')
        } else {
          /**
           * Handle OK responses
           */
          const result = await response.json()

          console.log(result)
        }
      } catch (err) {
        /**
         * Log any unexpected errors
         */
        console.error(err)

        Helper.addToastMessage(
          this.toastEl,
          window.localization.getLocalizedText('somethingWentWrong'),
          'danger'
        )
      } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none'
      }
    }
  }
}

export default FormHandler
