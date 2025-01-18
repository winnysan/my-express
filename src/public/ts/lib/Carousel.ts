import Helper from './Helper'

enum Direction {
  PREV = 'prev',
  NEXT = 'next',
}

/**
 * Carousel class for managing a responsive image carousel
 */
class Carousel {
  private carouselEl: HTMLDivElement | null
  private items: HTMLCollectionOf<HTMLElement> = {} as HTMLCollectionOf<HTMLElement>
  private nav: NodeListOf<HTMLDivElement>
  private small: number = 640
  private medium: number = 768
  private large: number = 1280
  private size: number = 1
  private gap: number = 24
  private width: number = 0
  private startX: number = 0
  private endX: number = 0

  /**
   * Create instance of carousel
   * @param carouselId
   */
  constructor(carouselId: string) {
    this.carouselEl = Helper.selectElement<HTMLDivElement>(carouselId)
    this.items = this.carouselEl?.getElementsByClassName('carousel-item') as HTMLCollectionOf<HTMLElement>
    this.nav = this.carouselEl?.querySelectorAll('.carousel-nav') as NodeListOf<HTMLDivElement>

    if (this.carouselEl && this.items.length > 0 && this.nav.length > 0) this.initialize()
  }

  /**
   * Initialize the carousel, settings the number of items, width and event listeners
   */
  private initialize(): void {
    this.determineSize()
    this.setMinItems()
    this.width = this.getSize()
    this.setCarouselDimension()

    this.clone(Direction.PREV)
    this.build()

    this.addClickEvents()
    this.addTouchEvents()
    this.addResizeEvent()
  }

  /**
   * Determines the number of items to display based on the window width
   */
  private determineSize(): void {
    const windowWidth = window.innerWidth

    if (windowWidth <= this.small) this.size = 1
    else if (windowWidth > this.small && windowWidth <= this.medium) this.size = 2
    else if (windowWidth > this.medium && windowWidth <= this.large) this.size = 3
    else this.size = 4
  }

  /**
   * Ensures a minimum number of items by cloning existing items if necessary
   */
  private setMinItems(): void {
    const minItems = this.size + 2

    if (this.items.length < minItems) {
      Array.from(this.items).forEach(item => {
        const clone = item.cloneNode(true)
        this.carouselEl!.append(clone as HTMLElement)
      })
    }

    if (this.items.length < minItems) {
      this.setMinItems()
    }

    if (this.items.length < minItems) this.setMinItems()
  }

  /**
   * Calculates the width of each item based on the container size and number of items
   * @returns
   */
  private getSize(): number {
    let width = this.carouselEl!.clientWidth

    if (this.size > 1) {
      let diff = this.gap / (this.size / (this.size - 1))

      return width / this.size - diff
    } else {
      return width / this.size
    }
  }

  /**
   * Sets the heigth of the carousel and position navigation buttons
   */
  private setCarouselDimension(): void {
    this.carouselEl!.style.height = this.width + 96 + 'px'

    this.nav.forEach(nav => {
      const navHeight = nav.clientHeight
      const topPosition = this.width / 2 - navHeight / 2
      nav.style.top = `${topPosition}px`
    })
  }

  /**
   * Builds the layout of the carousel items, positioning them accordingly
   */
  private build(): void {
    let left = this.width * -1

    Array.from(this.items).forEach((item, index) => {
      item.style.width = this.width + 'px'
      item.style.left = left + 'px'
      left += this.width

      if (index > 0) left += this.gap
    })
  }

  /**
   * Clones an item in the carousel in the specified direction
   * @param direction
   */
  private clone(direction: Direction = Direction.NEXT): void {
    let item: HTMLElement | null = null

    if (direction === Direction.NEXT) item = this.items[0]
    else if (direction === Direction.PREV) item = this.items[this.items.length - 1]

    if (item) {
      let clone = item.cloneNode(true) as HTMLElement

      if (direction === Direction.NEXT) this.carouselEl!.append(clone)
      else if (direction === Direction.PREV) this.carouselEl!.prepend(clone)

      item.remove()
    }
  }

  /**
   * Moves the carousel to the next item
   */
  private next(): void {
    this.clone(Direction.NEXT)
    this.build()
  }

  /**
   * Moves the carousel to the previous item
   */
  private prev(): void {
    this.clone(Direction.PREV)
    this.build()
  }

  /**
   * Moves the carousel in the specified direction based on the clicked navigation element
   * @param element
   */
  private move(element: HTMLElement): void {
    let direction = element.getAttribute('data-dir')

    if (direction === Direction.NEXT) this.next()
    else if (direction === Direction.PREV) this.prev()
  }

  /**
   * Adds click event listeners for move functionality on the carousel
   */
  private addClickEvents(): void {
    this.nav.forEach(nav => nav.addEventListener('click', () => this.move(nav)))
  }

  /**
   * Adds touch events listeners for swipe functionality on the carousel
   */
  private addTouchEvents(): void {
    if (this.carouselEl) {
      this.carouselEl.addEventListener('touchstart', e => this.handleTouchStart(e))
      this.carouselEl.addEventListener('touchend', e => this.handleTouchEnd(e))
    }
  }

  /**
   * Handles the touch start event by recording the starting position of the touch
   * @param e
   */
  private handleTouchStart(e: TouchEvent): void {
    this.startX = e.touches[0].clientX
  }

  /**
   * Handles the touch end event by recording the ending position of the touch and evaluting the swipe direction
   * @param e
   */
  private handleTouchEnd(e: TouchEvent): void {
    this.endX = e.changedTouches[0].clientX
    this.handleSwipe()
  }

  /**
   * Evalutes the swipe direction and triggers the next or previous item based on the swipe
   */
  private handleSwipe(): void {
    if (this.startX > this.endX + 50) this.next()
    else if (this.startX < this.endX - 50) this.prev()
  }

  /**
   * Handles window resize events
   */
  private handleResize(): void {
    this.determineSize()
    this.width = this.getSize()
    this.build()
    this.setCarouselDimension()
  }

  /**
   * Adds resize event listener for resize the carousel
   */
  private addResizeEvent(): void {
    window.addEventListener('resize', Helper.debounce(this.handleResize.bind(this), 500))
  }
}

export default Carousel
