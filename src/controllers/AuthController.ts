import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

/**
 * Controller class for handling auth-related operations
 */
class AuthController {
  /**
   * Renders the registration page
   */
  public registerPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('auth/register', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.registerPage,
      csrfToken: req.csrfToken?.() || '',
    })
  })

  /**
   * Registers a new user
   */
  public registerUser = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { email, name, password, passwordConfirmation } = req.body

    console.log({ email, name, password, passwordConfirmation })

    res.status(201).json({ message: 'success' })
  })
}

export default new AuthController()
