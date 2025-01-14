import express from 'express'
import AuthController from '../controllers/AuthController'
import AuthMiddleware from '../middlewares/AuthMiddleware'
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
    this.router.get('/register', AuthMiddleware.public, AuthController.registerPage)
    this.router.post('/register', AuthMiddleware.public, ValidationMiddleware.register, AuthController.registerUser)

    /**
     * Login
     */
    this.router.get('/login', AuthMiddleware.public, AuthController.loginPage)
    this.router.post('/login', AuthMiddleware.public, ValidationMiddleware.login, AuthController.loginUser)

    /**
     * Logout
     */
    this.router.post('/logout', AuthMiddleware.protect, AuthController.logoutUser)

    /**
     * Forgot password
     */
    this.router.get('/forgotten-password', AuthMiddleware.public, AuthController.forgotPasswordPage)
    this.router.post(
      '/forgotten-password',
      AuthMiddleware.public,
      ValidationMiddleware.forgot,
      AuthController.forgotPasswordSendMail
    )
  }
}

export default new AuthRouter().router
