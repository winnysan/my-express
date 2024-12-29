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
      ('0' + date.getDate()).slice(-2) +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      date.getFullYear()

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
}
