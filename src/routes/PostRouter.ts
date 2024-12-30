import express from 'express'

/**
 * Router for handling post-related routes
 */
class PostRouter {
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
     * Post page
     */
    this.router.get('/', (req: express.Request, res: express.Response) => {
      res.render('post/index')
    })
  }
}

export default new PostRouter().router
