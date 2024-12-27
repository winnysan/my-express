import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

/**
 * Main application class for setting up and running the Express server
 */
class App {
  public app: express.Application
  private port: number | undefined

  constructor() {
    this.app = express()
    this.port = process.env.PORT
  }

  /**
   * Starts the Express server and listens for incomming connections
   * @public
   */
  public start(): void {
    this.app.listen(this.port, () =>
      console.log(`App running on http:localhost:${this.port}`)
    )
  }
}

export default App
