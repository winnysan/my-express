/**
 * Utility class
 */
class Helper {
  /**
   * Get current date information
   * @return {string}
   */
  public static getCurrentDate(): string {
    const date = new Date()
    const day =
      ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()

    return day
  }

  /**
   * Get current time information
   * @return {string}
   */
  public static getCurrentTime(): string {
    const date = new Date()
    const time = date.toLocaleTimeString() + '.' + date.getMilliseconds()

    return time
  }

  /**
   * Slugifies a string to making it URL-friendly
   * @param string
   */
  public static slugify(string: string): string {
    return String(string)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  /**
   * Convert markdown text to HTML
   * @param markdownText
   */
  public static parseBody(markdownText: string): string {
    /**
     * Split the markdown text into lines
     */
    const lines = markdownText.split('\n')

    /**
     * Initialize an array for processed lines
     */
    const htmlLines = []

    for (let line of lines) {
      let htmlLine = ''

      /**
       * Process images in the line using a regular expression
       */
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g

      line = line.replace(imageRegex, (match, alt, src) => {
        return `<img src="${src}" alt="${alt}" />`
      })

      /**
       * Check for headings
       */
      if (line.startsWith('### ')) {
        htmlLine = `<h3>${line.substring(4)}</h3>`
      } else if (line.startsWith('## ')) {
        htmlLine = `<h2>${line.substring(3)}</h2>`
      } else if (line.startsWith('# ')) {
        /**
         * Converts the first-level heading to the species level
         */
        htmlLine = `<h2>${line.substring(2)}</h2>`
      } else if (line.trim() === '') {
        htmlLine = ''
      } else {
        /**
         * Wrap the line in <p>
         */
        htmlLine = `<p>${line}</p>`
      }

      htmlLines.push(htmlLine)
    }

    /**
     * Join the processed lines into a single HTML string
     */
    return htmlLines.join('\n')
  }
}

export default Helper
