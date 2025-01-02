import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import User from '../models/User'
import { Role } from '../types/enums'

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
    const { email, name, password } = req.body
    const isAdmin: boolean = process.env.ADMIN_EMAIL === email

    const user = await User.create({
      email,
      name,
      password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
      role: isAdmin ? Role.ADMIN : undefined,
    })

    // TODO: login

    res.status(201).json({
      message: global.dictionary.messages.youHaveBeenRegistered,
      redirect: '/',
    })
  })
}

export default new AuthController()
