import express from 'express'
import PostController from '../controllers/PostController'
import AuthMiddleware from '../middlewares/AuthMiddleware'

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
    this.router.get('/', AuthMiddleware.protect, PostController.postsPage)
  }
}

export default new PostRouter().router
