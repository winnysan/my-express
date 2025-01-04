import Helper from './Helper'

/**
 * Handler for managing categories
 */
class CategoryHandler {
  private static instance: CategoryHandler | null = null
  private categoriesId: string
  private categoriesEl: HTMLDivElement | null = null
  private listenerAttached: boolean = false

  constructor(categoriesId: string) {
    this.categoriesId = categoriesId

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
      // attachEventListeners

      this.listenerAttached = true
    }
  }

  /**
   * Method to process the current DOM - add buttons to <li> elements and update states
   */
  private processDOM(): void {
    if (!this.categoriesEl) return

    // processDom
  }
}

export default CategoryHandler
