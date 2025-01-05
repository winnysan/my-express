import ApiClient, { ApiResponse } from './ApiCLient'
import Helper from './Helper'

type ApiCategoryResponse = ApiResponse & {
  status?: number
  newId?: string
}

type SendData = {
  action: string
  id?: string
  value?: string
}

enum CategoryAction {
  ADD_FIRST = 'add-first',
  ADD = 'add',
  ADD_NESTED = 'add-nested',
  DELETE = 'delete',
  UP = 'up',
  DOWN = 'down',
  RENAME = 'rename',
  SET_LOCALE = 'set-locale',
}

enum Locales {
  EN = 'en',
  SK = 'sk',
}

/**
 * Handler for managing categories
 */
class CategoryHandler {
  private static instance: CategoryHandler | null = null
  private categoriesId: string
  private categoriesEl: HTMLDivElement | null = null
  private listenerAttached: boolean = false
  private apiClient: ApiClient<ApiCategoryResponse>
  private inputDebounceMap: WeakMap<HTMLInputElement, (data: any) => void> = new WeakMap()

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
    this.apiClient = new ApiClient<ApiCategoryResponse>(`${window.location.protocol}//${window.location.host}/api`)

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
   * Public method to refresh the handler
   */
  public refresh(): void {
    const newCategoriesEl = Helper.selectElement<HTMLDivElement>(this.categoriesId)

    if (newCategoriesEl && newCategoriesEl !== this.categoriesEl) {
      /**
       * Remove event listeners from the old element
       */
      if (this.categoriesEl && this.listenerAttached) {
        this.categoriesEl.removeEventListener('input', this.handleInputBound)
        this.categoriesEl.removeEventListener('click', this.handleClickBound)
        this.categoriesEl.removeEventListener('click', this.handleChangeBound)
      }

      /**
       * Update categoriesEl to the new element
       */
      this.categoriesEl = newCategoriesEl

      /**
       * Attach event listeners to the new element
       */
      if (this.categoriesEl) {
        this.categoriesEl.addEventListener('input', this.handleInputBound)
        this.categoriesEl.addEventListener('click', this.handleClickBound)
        this.categoriesEl.addEventListener('click', this.handleChangeBound)
      }

      /**
       * Reprocess tje DOM
       */
      this.processDOM()
    } else if (!this.categoriesEl) {
      /**
       * If cateforiesEl was not found, attempt to attach event listeners
       */
      this.attachEventListeners()
      this.processDOM()
    } else {
      /**
       * categoriesEl is the same, just reprocess the DOM
       */
      this.processDOM()
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

    /**
     * Update buttons
     */
    this.updateButtonState()
    this.showOrHideAddFirstButton()
  }

  /**
   * Event handler for inputs events
   * @param event
   */
  private handleInput(event: Event): void {
    const target = event.target as HTMLElement

    if (target.tagName.toLowerCase() === 'input') {
      const input: HTMLInputElement = target as HTMLInputElement
      const li: HTMLLIElement | null = input.closest('li')

      if (li) {
        const data: SendData = { action: CategoryAction.RENAME, id: li.id, value: input.value }

        /**
         * Get or create a debounced function for this input
         */
        let debouncedSendData = this.inputDebounceMap.get(input)

        if (!debouncedSendData) {
          debouncedSendData = Helper.debounce((data: any) => this.sendData(data), 500)

          this.inputDebounceMap.set(input, debouncedSendData)
        }

        /**
         * Call the debounced function with the data
         */
        debouncedSendData(data)
      }
    }
  }

  /**
   * Event handler for click events
   * @param event
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement

    if (target.id === 'add-first') this.addFirstCategory()
    else if (target.classList.contains('add')) this.addCategory(target)
    else if (target.classList.contains('add-nested')) this.addNestedCategory(target)
    else if (target.classList.contains('delete')) this.deleteCategory(target)
    else if (target.classList.contains('up')) this.moveUpCategory(target)
    else if (target.classList.contains('down')) this.moveDownCategory(target)
  }

  /**
   * Event handler for change events
   * @param event
   */
  private handleChange(event: Event): void {
    const target = event.target as HTMLElement

    if (target.tagName.toLowerCase() === 'select' && target.classList.contains('category-locale')) {
      const select: HTMLSelectElement = target as HTMLSelectElement
      const li: HTMLLIElement | null = select.closest('li')

      if (li) {
        /**
         * Send data to API
         */
        const data: SendData = { action: CategoryAction.SET_LOCALE, id: li.id, value: select.value }
        this.sendData(data)
      }
    }
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
    addNestedButton.className = 'add-nested'
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

  /**
   * Create a new LI element with input and buttons
   * @param tempId
   * @returns
   */
  private createLiElement(tempId: string): HTMLLIElement {
    const li: HTMLLIElement = document.createElement('li')
    li.id = tempId

    const input: HTMLInputElement = document.createElement('input')
    input.type = 'text'
    input.value = window.localization.getLocalizedText('new')

    const select: HTMLSelectElement = this.createSelect()

    const buttonGroup: HTMLDivElement = this.createButtons()

    li.appendChild(input)
    li.appendChild(select)
    li.appendChild(buttonGroup)

    return li
  }

  /**
   * Create a select element for category locales
   * @returns
   */
  private createSelect(): HTMLSelectElement {
    const select: HTMLSelectElement = document.createElement('select')
    select.className = 'category-locale'

    const locales = Object.values(Locales)
    locales.forEach(locale => {
      const option = document.createElement('option')
      option.value = locale
      option.textContent = window.localization.getLocalizedText(locale)

      select.appendChild(option)
    })

    return select
  }

  /**
   * Method to send dato to the API
   * @param data
   * @param tempId
   */
  private sendData(data: SendData, tempId?: string) {
    this.apiClient
      .fetch(data, 'categories')
      .then(response => {
        if (response.newId && tempId) {
          /**
           * Replace temporaty ID with the actual _id from the databae
           */
          const li = Helper.selectElement<HTMLLIElement>(`#${tempId}`)
          if (li) li.id = response.newId
        }

        console.log(response)
      })
      .catch(err => console.error(err))
  }

  /**
   * Genearate a unique 8-digit ID
   */
  private generateUniqueId(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
  }

  /**
   * Update the state of the Up and Down buttons
   * @returns
   */
  private updateButtonState(): void {
    if (!this.categoriesEl) return

    const allLists: NodeListOf<HTMLUListElement> = this.categoriesEl.querySelectorAll('ul')

    allLists.forEach((ul: HTMLUListElement) => {
      const listItems: NodeListOf<HTMLLIElement> = ul.querySelectorAll('li')

      listItems.forEach((li: HTMLLIElement, index: number) => {
        const upButton: HTMLButtonElement | null = li.querySelector('button.up')
        const downButton: HTMLButtonElement | null = li.querySelector('button.down')

        if (upButton) upButton.disabled = index === 0
        if (downButton) downButton.disabled = index === listItems.length - 1
      })
    })
  }

  /**
   * Show or hide the Add First button based on wheather categories exist
   */
  private showOrHideAddFirstButton(): void {
    if (!this.categoriesEl) return

    let addFirstButton: HTMLButtonElement | null = Helper.selectElement<HTMLButtonElement>('#add-first')
    const existingUl: HTMLUListElement | null = this.categoriesEl.querySelector('ul')

    if (existingUl && existingUl.querySelectorAll('li').length > 0) {
      if (addFirstButton) {
        addFirstButton.style.display = 'none'
      }
    } else {
      if (addFirstButton) {
        addFirstButton.style.display = 'block'
      } else {
        /**
         * Create the Add First button if it does not exist
         */
        addFirstButton = document.createElement('button')
        addFirstButton.id = 'add-first'
        addFirstButton.textContent = window.localization.getLocalizedText('addFirst')
        this.categoriesEl.appendChild(addFirstButton)
      }
    }
  }

  /**
   * Add the first category
   */
  private addFirstCategory(): void {
    const tempId = `category-${this.generateUniqueId()}`

    const newLi: HTMLLIElement = this.createLiElement(tempId)

    /**
     * Create UL element and add the new LI
     */
    const ul: HTMLUListElement = document.createElement('ul')
    ul.appendChild(newLi)

    if (this.categoriesEl) {
      /**
       * Clear 'add-first' button
       */
      this.categoriesEl.innerHTML = ''
      this.categoriesEl.appendChild(ul)

      /**
       * Send data to API
       */
      const data: SendData = { action: CategoryAction.ADD_FIRST }
      this.sendData(data, tempId)

      /**
       * Update buttons
       */
      this.updateButtonState()
      this.showOrHideAddFirstButton()
    }
  }

  /**
   * Add a category after the selected item
   * @param target
   */
  private addCategory(target: HTMLElement): void {
    const li: HTMLLIElement | null = target.closest('li') as HTMLLIElement | null

    if (li) {
      const tempId = `category-${this.generateUniqueId()}`
      const newLi: HTMLLIElement = this.createLiElement(tempId)

      /**
       * Insert the new LI after the current LI
       */
      li.parentNode?.insertBefore(newLi, li.nextSibling)

      /**
       * Send data to API
       */
      const data: SendData = { action: CategoryAction.ADD, id: li.id }
      this.sendData(data, tempId)

      /**
       * Update buttons
       */
      this.updateButtonState()
      this.showOrHideAddFirstButton()
    }
  }

  /**
   * Add a nested category
   * @param target
   */
  private addNestedCategory(target: HTMLElement): void {
    const li: HTMLLIElement | null = target.closest('li') as HTMLLIElement | null

    if (li) {
      const tempId = `category-${this.generateUniqueId()}`

      /**
       * Find or created nested UL
       */
      let ul: HTMLUListElement | null = li.querySelector('ul')

      if (!ul) {
        ul = document.createElement('ul')
        li.appendChild(ul)
      }

      const newLi: HTMLLIElement = this.createLiElement(tempId)

      /**
       * Append the new LI to the nested UL
       */
      ul.append(newLi)

      /**
       * Send data to API
       */
      const data: SendData = { action: CategoryAction.ADD_NESTED, id: li.id }
      this.sendData(data, tempId)

      /**
       * Update buttons
       */
      this.updateButtonState()
      this.showOrHideAddFirstButton()
    }
  }

  /**
   * Remove a category and its subcategories
   * @param target
   */
  private deleteCategory(target: HTMLElement): void {
    const li: HTMLLIElement | null = target.closest('li') as HTMLLIElement | null

    if (li) {
      const confirmDelete: boolean = confirm(window.localization.getLocalizedText('categoryDeleteConfirm'))

      if (confirmDelete) {
        li.remove()

        /**
         * Send data to API
         */
        const data: SendData = { action: CategoryAction.DELETE, id: li.id }
        this.sendData(data)

        /**
         * Update buttons
         */
        this.updateButtonState()
        this.showOrHideAddFirstButton()
      }
    }
  }

  /**
   * Move a category up in the list
   * @param target
   */
  private moveUpCategory(target: HTMLElement): void {
    const li: HTMLLIElement | null = target.closest('li') as HTMLLIElement | null

    if (li) {
      const prevLi: HTMLLIElement | null = li.previousElementSibling as HTMLLIElement | null

      if (prevLi) {
        li.parentNode?.insertBefore(li, prevLi)

        /**
         * Send data to API
         */
        const data: SendData = { action: CategoryAction.UP, id: li.id }
        this.sendData(data)

        /**
         * Update buttons
         */
        this.updateButtonState()
        this.showOrHideAddFirstButton()
      }
    }
  }

  /**
   * Move a category down in the list
   * @param target
   */
  private moveDownCategory(target: HTMLElement): void {
    const li: HTMLLIElement | null = target.closest('li') as HTMLLIElement | null

    if (li) {
      const nextLi: HTMLLIElement | null = li.nextElementSibling as HTMLLIElement | null

      if (nextLi) {
        li.parentNode?.insertBefore(nextLi, li)

        /**
         * Send data to API
         */
        const data: SendData = { action: CategoryAction.DOWN, id: li.id }
        this.sendData(data)

        /**
         * Update buttons
         */
        this.updateButtonState()
        this.showOrHideAddFirstButton()
      }
    }
  }
}

export default CategoryHandler
