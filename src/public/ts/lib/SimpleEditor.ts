import Helper from './Helper'

/**
 * A simple markdown editor class that replaces a textarea element
 */
class SimpleEditor {
  private formEl: HTMLFormElement
  private inputEl: HTMLTextAreaElement | null
  private editorEl: HTMLDivElement = document.createElement('div')
  private toolbarEl: HTMLDivElement = document.createElement('div')
  private contentEl: HTMLTextAreaElement = document.createElement('textarea')

  /**
   * Factory method to create an instance of SimpleEditor
   * @param formSelector
   * @returns
   */
  static create(formSelector: string): SimpleEditor | undefined {
    const form = Helper.selectElement<HTMLFormElement>(formSelector)

    if (form && form.getAttribute('data-form') === 'editor') return new SimpleEditor(formSelector)
    else return undefined
  }

  /**
   * Setting the constructor to private to avoid creating a direct instance
   * @param formSelector
   */
  private constructor(formSelector: string) {
    this.formEl = Helper.selectElement(formSelector) as HTMLFormElement
    this.inputEl = this.formEl.querySelector<HTMLTextAreaElement>('textarea[name="body"]')

    if (this.inputEl) this.initialize()
  }

  /**
   * Sets up the editor interface and event listeners
   * @returns
   */
  private initialize(): void {
    /**
     * Hide original textarea and set the content to the new textarea
     */
    this.inputEl!.style.display = 'none'
    this.contentEl.value = this.inputEl!.value

    /**
     * Add class for styling
     */
    this.editorEl.classList.add('editor')
    this.toolbarEl.classList.add('toolbar')
    this.contentEl.classList.add('content')

    /**
     * Create toolbar buttons an add event listeners
     */
    this.createToolbarButtons()
    this.addEventListeners()

    /**
     * Assemble the editor
     */
    this.editorEl.appendChild(this.toolbarEl)
    this.editorEl.appendChild(this.contentEl)
    this.inputEl!.parentNode!.insertBefore(this.editorEl, this.inputEl)

    /**
     * Update the textarea value on form submission
     */
    this.formEl.addEventListener('submit', () => (this.inputEl!.value = this.contentEl.value))
  }

  /**
   * Creates toolbar buttons for the editor
   */
  private createToolbarButtons(): void {
    const buttons = [
      { command: 'heading2', text: 'H2' },
      { command: 'heading3', text: 'H3' },
      { command: 'paragraph', text: 'P' },
      { command: 'insertImage', text: 'Image' },
    ]

    buttons.forEach(btn => {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = btn.text
      button.dataset.command = btn.command
      this.toolbarEl.appendChild(button)
    })
  }

  /**
   * Add event listeners to the toolbar and content
   */
  private addEventListeners(): void {
    //
  }
}

export default SimpleEditor
