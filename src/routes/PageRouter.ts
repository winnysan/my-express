import express from 'express'

/**
 * Router for handling page routes
 */
class PageRouter {
  public router: express.Router

  /**
   * Initializes a new instance of the Router and sets up the routes
   */
  constructor() {
    this.router = express.Router()
    this.setRoutes()
  }

  /**
   * Defines and sets the routes
   */
  private setRoutes(): void {
    /**
     * Home page
     */
    this.router.get('/', (req: express.Request, res: express.Response) => {
      res.render('index')
    })
  }
}

export default new PageRouter().router
