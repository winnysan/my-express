import CategoryHandler from './CategoryHandler'
import CategorySelectHandler from './CategorySelectHandler'
import FilterFormHandler from './FilterFormHandler'
import FormHandler from './FormHandler'
import Helper from './Helper'
import SimpleEditor from './SimpleEditor'

/**
 * Bootstrap class responsible for initializing various components and handling UI interactions
 */
class Bootstrap {
  static initialize(): void {
    /**
     * Navigation elements
     */
    const hamburgerButtonEl = Helper.selectElement<HTMLButtonElement>('#hamburger')
    const navigationEl = Helper.selectElement<HTMLUListElement>('.navigation')
    const headerOverlayEl = Helper.selectElement<HTMLDivElement>('#header-overlay')

    /**
     * Mobile menu toggle
     */
    hamburgerButtonEl?.addEventListener('click', () => {
      navigationEl?.classList.toggle('active')
      headerOverlayEl?.classList.toggle('active')
    })

    headerOverlayEl?.addEventListener('click', () => {
      navigationEl?.classList.remove('active')
      headerOverlayEl?.classList.remove('active')
    })

    /**
     * The current year in the footer
     */
    const yearEl = Helper.selectElement<HTMLSpanElement>('#year')
    if (yearEl) yearEl.innerText = String(new Date().getFullYear())

    /**
     * Form handlers
     */
    const editor = SimpleEditor.create('#form')

    new FormHandler('#form', editor)
    new FormHandler('#form-logout')

    new FilterFormHandler('#form-filter', ['categories', 'locales'])

    /**
     * Categories
     */
    const categoryHandler = CategoryHandler.getInstance('#categories')
    categoryHandler.refresh()

    /**
     * Categories select
     */
    new CategorySelectHandler('#categories-select')
  }
}

export default Bootstrap
