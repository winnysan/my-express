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
}

export default Helper
