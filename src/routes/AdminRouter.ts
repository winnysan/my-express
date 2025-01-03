import express from 'express'
import AdminController from '../controllers/AdminController'
import AuthMiddleware from '../middlewares/AuthMiddleware'

/**
 * Router for handling admin-related routes
 */
class AdminRouter {
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
     * Admin page
     */
    this.router.get('/', AuthMiddleware.protect, AuthMiddleware.admin, AdminController.adminPage)
  }
}

export default new AdminRouter().router
