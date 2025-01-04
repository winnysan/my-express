/**
 * Helper class for various utility functions
 */
class Helper {
  /**
   * Selects an element based on a CSS selector an casts it to the correct type
   * @param selector
   * @returns
   */
  static selectElement<T extends HTMLElement>(selector: string): T | null {
    return document.querySelector(selector) as T | null
  }

  /**
   * Static method to create or return a toast element by ID
   * @param id
   * @returns
   */
  static makeToast(id: string): HTMLUListElement {
    let toastEl = Helper.selectElement<HTMLUListElement>(id)

    if (!toastEl) {
      toastEl = document.createElement('ul')
      toastEl.id = id.replace('#', '')
      document.body.appendChild(toastEl)
    }

    toastEl.innerHTML = ''

    return toastEl
  }

  /**
   * Adds a toast message with a specified type and allows setting the disappearance time
   * @param toastEl
   * @param message
   * @param type
   * @param duration
   */
  static addToastMessage(
    toastEl: HTMLUListElement | undefined,
    message: string,
    type: 'info' | 'success' | 'warning' | 'danger' = 'info',
    duration: number = 3000
  ): void {
    if (!toastEl) return

    const li = document.createElement('li')
    li.textContent = message
    li.classList.add(type)

    toastEl.appendChild(li)

    setTimeout(() => {
      li.classList.add('fade-out')

      setTimeout(() => li.remove(), 500)
    }, duration)
  }

  /**
   * Creates a debounced version of a function that delays its executions
   * @param func
   * @param delay
   * @returns
   */
  static debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: number | undefined

    return (...args: Parameters<T>): void => {
      if (timeoutId) clearTimeout(timeoutId)

      timeoutId = window.setTimeout(() => func(...args), delay)
    }
  }
}

export default Helper
