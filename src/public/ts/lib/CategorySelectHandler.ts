import Helper from './Helper'

/**
 * Handler for selecting multiple categories
 */
class CategorySelectHandler {
  private containerEl: HTMLDivElement | null
  private inputEl!: HTMLInputElement
  private dropdownEl!: HTMLDivElement
  private listEl!: HTMLDivElement

  /**
   * Initialize the category select handler
   * @param selector
   */
  constructor(selector: string) {
    this.containerEl = Helper.selectElement<HTMLDivElement>(selector)

    if (this.containerEl) {
      this.inputEl = this.containerEl.querySelector('#categories-input') as HTMLInputElement
      this.dropdownEl = this.containerEl.querySelector('#categories-dropdown') as HTMLDivElement
      this.listEl = this.containerEl.querySelector('#categories-selected-list') as HTMLDivElement

      if (this.inputEl && this.dropdownEl && this.listEl) this.initialize()
    }
  }

  /**
   * Initializes event listeners
   */
  private initialize(): void {
    this.inputEl?.addEventListener('focus', () => this.showDropdown())
    document.addEventListener('click', e => this.handleDocumentClick(e))
    this.dropdownEl.addEventListener('click', e => this.handleDropdownClick(e))
    this.inputEl.addEventListener('input', () => this.filterCategories())
    this.listEl.addEventListener('click', e => this.handleSelectedCategoriesClick(e))
  }

  /**
   * Displays the dropdown menu and hide input element
   */
  private showDropdown(): void {
    this.inputEl.style.display = 'none'
    this.dropdownEl.style.display = 'flex'
  }

  /**
   * Hides the dropdown menu and display input element
   */
  private hideDropdown(): void {
    this.inputEl.style.display = 'flex'
    this.dropdownEl.style.display = 'none'
  }

  /**
   * Handles click events on the document to hide the dropdown when clicking outside
   * @param e
   */
  private handleDocumentClick(e: MouseEvent): void {
    if (!this.containerEl?.contains(e.target as Node)) this.hideDropdown()
  }

  /**
   * Handles click events on the dropdown menu to add categories to the selected list
   * @param e
   */
  private handleDropdownClick(e: MouseEvent): void {
    const target = e.target as HTMLElement

    if (target.classList.contains('dropdown-item')) {
      const catId = target.getAttribute('data-id')
      const catName = target.textContent?.trim()

      if (catId && catName) {
        this.addCategory(catId, catName)

        this.hideDropdown()
      }
    }
  }

  /**
   * Handles click events on the selected categories to remove them
   * @param e
   */
  private handleSelectedCategoriesClick(e: MouseEvent): void {
    const target = e.target as HTMLElement

    if (target.classList.contains('remove-category')) {
      const catId = target.getAttribute('data-id')

      if (catId) this.removeCategory(catId)
    }
  }

  /**
   * Add category to the selected categories
   * @param catId
   * @param catName
   */
  private addCategory(catId: string, catName: string): void {
    const span = document.createElement('span')

    span.classList.add('selected-category')
    span.setAttribute('data-id', catId)
    span.innerHTML = `${catName}
        <input type="hidden" name="categories[]" value="${catId}" />
        <button type="button" class="remove-category" data-id="${catId}">&times;</button>
    `

    this.listEl.appendChild(span)

    const dropdownItem = this.dropdownEl.querySelector(`.dropdown-item[data-id="${catId}"`) as HTMLDivElement

    if (dropdownItem) dropdownItem.style.display = 'none'
  }

  /**
   * Filters the categories in the dropdown based on the user's input
   */
  private filterCategories(): void {
    const filter = this.inputEl.value.toLowerCase()
    const items: NodeListOf<HTMLSpanElement> = this.dropdownEl.querySelectorAll('.drowdown-item')

    items.forEach(item => {
      const text = item.textContent?.toLowerCase()

      if (text?.includes(filter)) item.style.display = 'inline-block'
      else item.style.display = 'none'
    })
  }

  /**
   * Removes a category from selected categories
   * @param catId
   */
  private removeCategory(catId: string): void {
    const categorySpan = this.listEl.querySelector(`.selected-category[data-id="${catId}"]`)
    const dropdownItem = this.dropdownEl.querySelector(`.dropdown-item[data-id="${catId}"]`) as HTMLElement

    if (categorySpan) categorySpan.remove()
    if (dropdownItem) dropdownItem.style.display = 'inline-block'
  }
}

export default CategorySelectHandler
