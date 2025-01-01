import express from 'express'
import AuthController from '../controllers/AuthController'
import ValidationMiddleware from '../middlewares/ValidationMiddleware'

/**
 * Router for handling auth-related routes
 */
class AuthRouter {
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
     * Register
     */
    this.router.get('/register', AuthController.registerPage)
    this.router.post('/register', ValidationMiddleware.register, AuthController.registerUser)
  }
}

export default new AuthRouter().router
