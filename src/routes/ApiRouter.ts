import express from 'express'
import ApiController from '../controllers/ApiController'

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
  }
}

export default new ApiRouter().router
