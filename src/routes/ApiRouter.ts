import express from 'express'
import ApiCategoryController from '../controllers/ApiCategoryController'
import ApiController from '../controllers/ApiController'
import ApiPostController from '../controllers/ApiPostController'
import AuthMiddleware from '../middlewares/AuthMiddleware'

/**
 * Router for handling api-related routes
 */
class ApiRouter {
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
     * CSRF token
     */
    this.router.get('/csrf-token', ApiController.getCsrfToken)

    /**
     * Categories
     */
    this.router.post('/categories', AuthMiddleware.admin, ApiCategoryController.categoriesPost)

    /**
     * Posts
     */
    this.router.delete('/posts/:id', AuthMiddleware.protect, ApiPostController.deletePostById)
  }
}

export default new ApiRouter().router
