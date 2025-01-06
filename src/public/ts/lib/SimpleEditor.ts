import Helper from './Helper'

enum Command {
  HEADING2 = 'heading2',
  HEADING3 = 'heading3',
  PARAGRAPH = 'paragraph',
  INSERT_IMAGE = 'insertImage',
}

/**
 * A simple markdown editor class that replaces a textarea element
 */
class SimpleEditor {
  private formEl: HTMLFormElement
  private inputEl: HTMLTextAreaElement | null
  private editorEl: HTMLDivElement = document.createElement('div')
  private toolbarEl: HTMLDivElement = document.createElement('div')
  private contentEl: HTMLTextAreaElement = document.createElement('textarea')
  private images: { originalName: string; file: File }[] = []

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
    this.formEl.addEventListener('submit', () => this.updateTextarea())
  }

  /**
   * Update the hidden textarea with the current content of the editor
   */
  public updateTextarea(): void {
    if (this.inputEl) this.inputEl.value = this.contentEl.value
  }

  /**
   * Creates toolbar buttons for the editor
   */
  private createToolbarButtons(): void {
    const buttons = [
      { command: Command.HEADING2, text: 'H2' },
      { command: Command.HEADING3, text: 'H3' },
      { command: Command.PARAGRAPH, text: 'P' },
      { command: Command.INSERT_IMAGE, text: 'Image' },
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
    /**
     * Handle clicks on the toolbar buttons
     */
    this.toolbarEl.addEventListener('click', e => {
      const target = e.target as HTMLButtonElement

      if (target.dataset.command) this.executeCommand(target.dataset.command)
    })

    /**
     * Update the textarea value when the content changes
     */
    this.contentEl.addEventListener('input', () => this.updateTextarea())
  }

  /**
   * Executes editor commands based on the command string
   * @param command
   */
  private executeCommand(command: string): void {
    switch (command) {
      case Command.HEADING2:
        this.insertHeading('## ')
        break
      case Command.HEADING3:
        this.insertHeading('### ')
        break
      case Command.PARAGRAPH:
        this.insertParagraph()
        break
      case Command.INSERT_IMAGE:
        this.insertImage()
        break
    }
  }

  /**
   * Inserts markdown syntax for a heading at heading at the beginning of the current line
   * @param markdown
   */
  private insertHeading(markdown: string): void {
    const sectionStart = this.contentEl.selectionStart
    const sectionEnd = this.contentEl.selectionEnd

    /**
     * Get text before and after the selection
     */
    const textBefore = this.contentEl.value.substring(0, sectionStart)
    const textAfter = this.contentEl.value.substring(sectionEnd)

    /**
     * Find the start of the current line
     */
    const lineStart = textBefore.lastIndexOf('\n') + 1
    const currentLine = this.contentEl.value.substring(lineStart, sectionEnd)

    /**
     * Remove existing heading syntax
     */
    const currentLineWithoutHeading = currentLine.replace(/^#+\s*/, '')

    /**
     * Insert markdown heading
     */
    const newLine = markdown + currentLineWithoutHeading

    /**
     * Update content
     */
    const newText = this.contentEl.value.substring(0, lineStart) + newLine + textAfter
    this.contentEl.value = newText

    /**
     * Set cursor position
     */
    const newCursorPosition = lineStart + newLine.length
    this.contentEl.selectionStart = this.contentEl.selectionEnd = newCursorPosition

    /**
     * Dispatch 'input' event to update hidden textarea
     */
    this.contentEl.dispatchEvent(new Event('input'))
  }

  /**
   * Insert a paragraph (new line) at the current cursor position
   */
  private insertParagraph(): void {
    const sectionStart = this.contentEl.selectionStart
    const sectionEnd = this.contentEl.selectionEnd

    /**
     * Insert double newline for paragraph
     */
    const textBefore = this.contentEl.value.substring(0, sectionStart)
    const textAfter = this.contentEl.value.substring(sectionEnd)

    const newText = textBefore + '\n\n' + textAfter
    this.contentEl.value = newText

    /**
     * Set cursor position
     */
    const newCursorPosition = sectionStart + 2
    this.contentEl.selectionStart = this.contentEl.selectionEnd = newCursorPosition

    /**
     * Dispatch 'input' event to update hidden textarea
     */
    this.contentEl.dispatchEvent(new Event('input'))
  }

  /**
   * Handles image insertion into the editor
   */
  private insertImage() {
    /**
     * Create a file input element to select an image
     */
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files![0]
      if (file) {
        const originalName = file.name

        /**
         * Store the image file and its original name
         */
        this.images.push({ originalName, file })

        /**
         * Insert markdown syntax for the image at the cursor position
         */
        const sectionStart = this.contentEl.selectionStart
        const sectionEnd = this.contentEl.selectionEnd

        const textBefore = this.contentEl.value.substring(0, sectionStart)
        const textAfter = this.contentEl.value.substring(sectionEnd)
        const imageMarkdown = `![${originalName}](${originalName})`

        /**
         * Update content
         */
        this.contentEl.value = textBefore + imageMarkdown + textAfter

        /**
         * Set cursor position
         */
        const newCursorPosition = sectionStart + imageMarkdown.length
        this.contentEl.selectionStart = this.contentEl.selectionEnd = newCursorPosition

        /**
         * Dispatch 'input' event to update hidden textarea
         */
        this.contentEl.dispatchEvent(new Event('input'))
      }
    }

    /**
     * Trigger the file input dialog
     */
    input.click()
  }
}

export default SimpleEditor
