import mongoose from 'mongoose'
import Logger from './Logger'
import Message from './Message'

/**
 * A class responsible for connecting to the MongoDB database
 */
class Database {
  private uri: string

  /**
   * Creates an instance of the Database class
   * @param uri
   */
  constructor(uri: string) {
    this.uri = uri
  }

  /**
   * Connects to the MongoDB database using the provided URI
   */
  public async connect(): Promise<void> {
    try {
      const conn = await mongoose.connect(this.uri)
      console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err: unknown) {
      Logger.logToFile(Message.getErrorMessage(err))
      process.exit(1)
    }
  }
}

export default Database
