interface Element {
  element: string
  attr?: { [key: string]: string }
  children?: ElementData
  content?: string
}

export type ElementData = Element | Element[] | Element[][]

/**
 * A class responsible for rendering HTML elements based on a provided ElementData structure
 */
class RenderElement {
  private element: ElementData

  /**
   * Creates an instance of RenderElement
   * @param element
   */
  constructor(element: ElementData) {
    this.element = element
  }

  /**
   * Converts the ElementData into an HTML string
   * @returns
   */
  public toString(): string {
    return this.renderElement(this.element)
  }

  /**
   * Recursively renders an ElementData object into an HTML string
   * @param element
   * @returns
   */
  private renderElement(element: ElementData): string {
    /**
     * If the element is an array, recursively render each child and concatenate the results
     */
    if (Array.isArray(element)) {
      return element.map(e => this.renderElement(e)).join('')
    } else {
      /**
       * If the element has attributes, iterate over them and construct the attribute string
       */
      let attrs = ''

      if (element.attr) {
        for (const a in element.attr) {
          if (Object.prototype.hasOwnProperty.call(element.attr, a)) {
            attrs += ` ${a}="${element.attr[a]}"`
          }
        }
      }

      let content = ''

      /**
       * If the element has children, render them recursively
       */
      if (element.children) content = this.renderChildren(element.children)
      /**
       * If the element has inner conntent, use it directly
       */ else if (element.content) content = element.content

      /**
       * Construct and return the complete HTML taf with attributes an content
       */
      return `<${element.element}${attrs}>${content}</${element.element}>`
    }
  }

  /**
   * Recursively renders the children of an ElementData object into an HTML string
   * @param children
   * @returns
   */
  private renderChildren(children: ElementData): string {
    /**
     * If children is an array, recursively render each child and concatenate the results
     */
    if (Array.isArray(children)) {
      return children.map(child => this.renderChildren(child)).join('')
    } else {
      /**
       * If children is a single ELementData object, render it directly
       */
      return this.renderElement(children)
    }
  }
}

export default RenderElement
