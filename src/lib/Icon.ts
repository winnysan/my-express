import { IconData, icons } from '../assets/icons'

type IconOptions = {
  size?: number
  color?: string
  stroke?: number
}

/**
 * Class representing an SVG icon
 */
class Icon {
  private name: string
  private size: number
  private color: string
  private stroke: number

  /**
   * Create instance of icon
   * @param name
   * @param options
   */
  constructor(name: string, options?: IconOptions) {
    this.name = name
    this.size = options?.size || 1
    this.color = options?.color || 'currentColor'
    this.stroke = options?.stroke || 1
  }

  /**
   * Retrieves the icon data for the specified icon name
   * @returns
   */
  private getIconData(): IconData | undefined {
    return icons.find(icon => icon.name === this.name)
  }

  /**
   * Converts the icon data into an SVG string
   */
  public toSVG(): string {
    const iconData = this.getIconData()

    if (!iconData) throw new Error(`${this.name} ${global.dictionary.messages.notFound}`)

    const { attributes, vectors } = iconData

    const svgAttributes: { [key: string]: string | undefined } = {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: this.color !== 'none' ? this.color : undefined,
      stroke: this.color !== 'none' ? this.color : undefined,
      'stroke-width': this.stroke.toString(),
      style: `width: ${this.size}rem; height: ${this.size}rem;`,
      ...attributes,
    }

    /**
     * Filters out undefined values
     */
    const attrsString = Object.entries(svgAttributes)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    const vectorsString = vectors.join('\n')

    return `<svg ${attrsString}>
        ${vectorsString}
    </svg>`
  }
}

export default Icon
