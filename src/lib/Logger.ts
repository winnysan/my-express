import fs from 'fs'
import Helper from './Helper'
import Message from './Message'

/**
 * A class resposible for logging message to a file
 */
class Logger {
  /**
   * Logs a message to file
   * @param message
   * @returns {void}
   */
  public logToFile(message: unknown): void {
    try {
      const errorMessage = Message.getErrorMessage(message)
      const day = Helper.getCurrentDate()
      const time = Helper.getCurrentTime()

      const data = `${time} | ${errorMessage}\n`

      fs.writeFileSync(`logs/${day}.txt`, data, { flag: 'a' })
    } catch (err: unknown) {
      console.error('logToFile', Message.getErrorMessage(err))
    }
  }
}

export default new Logger()
