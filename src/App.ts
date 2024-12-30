import dotenv from 'dotenv'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import path from 'path'
import ErrorMiddleware from './middlewares/ErrorMiddleware'
import LocalizationMiddleware from './middlewares/LocalizationMiddleware'

dotenv.config()

/**
 * Main application class for setting up and running the Express server
 */
class App {
  public app: express.Application
  private port: number | undefined

  /**
   * Initializes a new instance of App class
   */
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.setMiddleware()
    this.setViewEngine()
    this.setRoutes()
    this.setErrorHandlers()
  }

  /**
   * Set middlewares
   * @private
   */
  private setMiddleware(): void {
    this.app.use(LocalizationMiddleware.use())
    this.app.use(express.static(path.join(__dirname, './public')))
  }

  /**
   * Set view engine
   * @private
   */
  private setViewEngine(): void {
    this.app.use(expressLayouts)
    this.app.set('layout', 'layouts/main')
    this.app.set('view engine', 'ejs')
    this.app.set('views', path.join(__dirname, 'views'))
  }

  /**
   * Set routes
   * @private
   */
  private setRoutes(): void {
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.render('index')
    })
  }

  /**
   * Sets up error handling middleware for handling 404 errors and other server errors
   * @private
   */
  private setErrorHandlers(): void {
    this.app.use(ErrorMiddleware.notFound)
    this.app.use(ErrorMiddleware.errorHandler)
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
