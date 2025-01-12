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

  /**
   * Generates a diacritics-insensitive regular expression string
   * @param str
   * @returns
   */
  public static diacriticsInsensitiveRegex(str: string): string {
    return str
      .replace(/a/g, '[aáàäâãåæāăą]')
      .replace(/A/g, '[AÁÀÄÂÃÅÆĀĂĄ]')
      .replace(/e/g, '[eéèëêēĕėę]')
      .replace(/E/g, '[EÉÈËÊĒĔĖĘ]')
      .replace(/i/g, '[iíìïîīĭį]')
      .replace(/I/g, '[IÍÌÏÎĪĬĮ]')
      .replace(/o/g, '[oóòöôõøōŏő]')
      .replace(/O/g, '[OÓÒÖÔÕØŌŎŐ]')
      .replace(/u/g, '[uúùüûūŭů]')
      .replace(/U/g, '[UÚÙÜÛŪŬŮ]')
      .replace(/y/g, '[yýÿỳ]')
      .replace(/Y/g, '[YÝŸỲ]')
      .replace(/c/g, '[cçčć]')
      .replace(/C/g, '[CÇČĆ]')
      .replace(/d/g, '[dďḋ]')
      .replace(/D/g, '[DĎḊ]')
      .replace(/l/g, '[lĺļľł]')
      .replace(/L/g, '[LĹĻĽŁ]')
      .replace(/n/g, '[nñňń]')
      .replace(/N/g, '[NÑŇŃ]')
      .replace(/r/g, '[rřŕ]')
      .replace(/R/g, '[RŘŔ]')
      .replace(/s/g, '[sšś]')
      .replace(/S/g, '[SŠŚ]')
      .replace(/t/g, '[tťṭ]')
      .replace(/T/g, '[TŤṪ]')
      .replace(/z/g, '[zžźż]')
      .replace(/Z/g, '[ZŽŹŻ]')
  }
}

export default Helper
