import Helper from './Helper'
import SimpleEditor from './SimpleEditor'
import SpaRouter from './SpaRouter'

/**
 * A class to handle form submission
 */
class FormHandler {
  private formEl: HTMLFormElement | null
  private toastEl: HTMLUListElement | undefined
  private editor?: SimpleEditor

  /**
   * Initialize the FormHandler
   * @param formSelector
   */
  constructor(formSelector: string, editor?: SimpleEditor) {
    this.formEl = Helper.selectElement<HTMLFormElement>(formSelector)
    this.editor = editor

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

      const loadingIndicator: HTMLDivElement | null = Helper.selectElement<HTMLDivElement>('#loading-indicator')

      /**
       * Remove any existing error indicators
       */
      this.formEl.querySelectorAll('.is-error').forEach(element => element.classList.remove('is-error'))

      /**
       * Append images present in the content
       */
      if (this.editor) {
        console.log('editor')
        console.log(this.editor.getImages())

        /**
         * Update the textarea value with the latest content
         */
        this.editor.updateTextarea()

        /**
         * Get the content from the editor
         */
        const content = this.editor.contentEl.value

        /**
         * Use a regular expression to find all markdown image syntaxes
         */
        const imageMarkdownRegex = /!\[[^\]]*\]\(([^)]+)\)/g
        let match
        const currentImageNames = new Set<string>()

        /**
         * Extract image names from the markdown content
         */
        while ((match = imageMarkdownRegex.exec(content)) !== null) {
          const imageName = match[1]
          currentImageNames.add(imageName)
        }

        /**
         * Append only images present in the content
         */
        this.editor.getImages().forEach(image => {
          if (currentImageNames.has(image.originalName)) {
            formData.append('files', image.file, image.originalName)
          }
        })
      }

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
          let message: string = window.localization.getLocalizedText('somethingWentWrong')

          if (result.error?.message) message = result.error.message

          Helper.addToastMessage(this.toastEl, message, 'danger')
        } else {
          /**
           * Handle OK responses
           */
          const result = await response.json()

          /**
           * Display validation errors
           */
          if (
            Array.isArray(result?.validation) &&
            result.validation.every(
              (error: any) => typeof error.field === 'string' && typeof error.message === 'string'
            )
          ) {
            result.validation.forEach((error: { field: string; message: string }) => {
              /**
               * Hoghlight the form field that caused the error
               */
              const inputEl = this.formEl?.querySelector(`[name="${error.field}"]`)
              if (inputEl) inputEl.classList.add('is-error')

              Helper.addToastMessage(this.toastEl, error.message, 'danger')
            })
          }

          /**
           * Show message from result
           */
          if (result.message) Helper.addToastMessage(this.toastEl, result.message, 'success')

          /**
           * Handle redirect
           */
          if (result.redirect) SpaRouter.navigateTo(result.redirect)
        }
      } catch (err) {
        /**
         * Log any unexpected errors
         */
        console.error(err)

        Helper.addToastMessage(this.toastEl, window.localization.getLocalizedText('somethingWentWrong'), 'danger')
      } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none'
      }
    }
  }
}

export default FormHandler
