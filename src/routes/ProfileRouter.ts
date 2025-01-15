import express from 'express'
import ProfileController from '../controllers/ProfileController'
import AuthMiddleware from '../middlewares/AuthMiddleware'
import ValidationMiddleware from '../middlewares/ValidationMiddleware'

/**
 * Router for handling profile-related routes
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
     * Profile page
     */
    this.router.get('/', AuthMiddleware.protect, ProfileController.profilePage)

    /**
     * Account data change
     */
    this.router.post('/account', AuthMiddleware.protect, ValidationMiddleware.account, ProfileController.accountChange)
  }
}

export default new AdminRouter().router
