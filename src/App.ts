import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import path from 'path'
import Database from './lib/Database'
import AjaxMiddleware from './middlewares/AjaxMiddleware'
import CsrfMiddleware from './middlewares/CsrfMiddleware'
import ErrorMiddleware from './middlewares/ErrorMiddleware'
import LocalizationMiddleware from './middlewares/LocalizationMiddleware'
import upload from './middlewares/UploadMiddleware'
import AuthRouter from './routes/AuthRouter'
import PageRouter from './routes/PageRouter'
import PostRouter from './routes/PostRouter'

dotenv.config()

/**
 * Main application class for setting up and running the Express server
 */
class App {
  public app: express.Application
  private port: number | undefined
  private db: Database

  /**
   * Initializes a new instance of App class
   */
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.db = new Database(process.env.MONGO_URI)

    this.connectDatabase()
    this.setMiddleware()
    this.setViewEngine()
    this.setRoutes()
    this.setErrorHandlers()
  }

  /**
   * Connect to the MongoDB database
   */
  private async connectDatabase(): Promise<void> {
    await this.db.connect()
  }

  /**
   * Set middlewares
   * @private
   */
  private setMiddleware(): void {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cors())
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    )
    this.app.use(upload.array('files'))
    this.app.use(CsrfMiddleware.init())
    this.app.use(AjaxMiddleware.use())
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
    this.app.use('/', PageRouter)
    this.app.use('/posts', PostRouter)
    this.app.use('/auth', AuthRouter)
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
    this.app.listen(this.port, () => console.log(`App running on http://localhost:${this.port}`))
  }
}

export default App
