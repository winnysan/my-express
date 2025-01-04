import Helper from './Helper'

/**
 * Handler for managing categories
 */
class CategoryHandler {
  private static instance: CategoryHandler | null = null
  private categoriesId: string
  private categoriesEl: HTMLDivElement | null = null
  private listenerAttached: boolean = false

  /**
   * Bind the event handler to avoid multiple bindings
   */
  private handleInputBound: (event: Event) => void
  private handleClickBound: (event: MouseEvent) => void
  private handleChangeBound: (event: Event) => void

  /**
   * Private contructor to secure the Singleton pattern
   * @param categoriesId
   */
  private constructor(categoriesId: string) {
    this.categoriesId = categoriesId

    this.handleInputBound = this.handleInput.bind(this)
    this.handleClickBound = this.handleClick.bind(this)
    this.handleChangeBound = this.handleChange.bind(this)

    this.initialize()
  }

  /**
   * Static method to get the singleton instance
   * @param categoriesId
   * @returns
   */
  public static getInstance(categoriesId: string): CategoryHandler {
    if (!CategoryHandler.instance) {
      CategoryHandler.instance = new CategoryHandler(categoriesId)
    }

    return CategoryHandler.instance
  }

  /**
   * Initialize the handler - attach event listeners once and process the DOM
   */
  private initialize(): void {
    this.attachEventListeners()
    this.processDOM()
  }

  /**
   * Method to attach event listeners
   */
  private attachEventListeners(): void {
    this.categoriesEl = Helper.selectElement<HTMLDivElement>(this.categoriesId)

    if (this.categoriesEl && !this.listenerAttached) {
      this.categoriesEl.addEventListener('input', this.handleInputBound)
      this.categoriesEl.addEventListener('click', this.handleClickBound)
      this.categoriesEl.addEventListener('change', this.handleChangeBound)

      this.listenerAttached = true
    }
  }

  /**
   * Method to process the current DOM - add buttons to <li> elements and update states
   */
  private processDOM(): void {
    if (!this.categoriesEl) return

    const existingList: NodeListOf<HTMLLIElement> = this.categoriesEl.querySelectorAll('li')

    existingList.forEach((li: HTMLLIElement) => {
      const buttonGroup: HTMLDivElement | null = li.querySelector('.buttons-group')
      if (buttonGroup && buttonGroup.children.length === 0) {
        buttonGroup.appendChild(this.createButtons())
      }
    })
  }

  /**
   * Event handler for inputs events
   * @param event
   */
  private handleInput(event: Event): void {
    const target = event.target as HTMLElement

    //
  }

  /**
   * Event handler for click events
   * @param event
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement

    //
  }

  /**
   * Event handler for change event
   * @param event
   */
  private handleChange(event: Event): void {
    const target = event.target as HTMLElement

    //
  }

  /**
   * Create a group of buttons for a category
   * @returns
   */
  private createButtons(): HTMLDivElement {
    const buttonGroup: HTMLDivElement = document.createElement('div')
    buttonGroup.className = 'buttons-group'

    const addButton: HTMLButtonElement = document.createElement('button')
    addButton.className = 'add'
    addButton.textContent = window.localization.getLocalizedText('add')

    const addNestedButton: HTMLButtonElement = document.createElement('button')
    addNestedButton.className = 'addNested'
    addNestedButton.textContent = window.localization.getLocalizedText('addNested')

    const deleteButton: HTMLButtonElement = document.createElement('button')
    deleteButton.className = 'delete'
    deleteButton.textContent = window.localization.getLocalizedText('delete')

    const upButton: HTMLButtonElement = document.createElement('button')
    upButton.className = 'up'
    upButton.textContent = window.localization.getLocalizedText('up')

    const downButton: HTMLButtonElement = document.createElement('button')
    downButton.className = 'down'
    downButton.textContent = window.localization.getLocalizedText('down')

    buttonGroup.appendChild(addButton)
    buttonGroup.appendChild(addNestedButton)
    buttonGroup.appendChild(deleteButton)
    buttonGroup.appendChild(upButton)
    buttonGroup.appendChild(downButton)

    return buttonGroup
  }
}

export default CategoryHandler
