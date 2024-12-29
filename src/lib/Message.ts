/**
 *  class responsible for handling and formatting error messages
 */
class Message {
  /**
   * Extracts a human-readdable message from an unknown error
   * @param error
   * @returns {string}
   */
  public getErrorMessage(error: unknown): string {
    let message: string

    if (error instanceof Error) {
      message = error.message
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String((error as { message: unknown }).message)
    } else if (typeof error === 'string') {
      message = error
    } else {
      message = 'Translate: Something Went Wrong'
    }

    return message
  }
}

export default new Message()
