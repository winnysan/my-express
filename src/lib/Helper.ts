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
}

export default Helper
