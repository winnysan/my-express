import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import RenderElement, { ElementData } from '../lib/RenderElement'
import SessionManger from '../lib/SesionManager'
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
    const form: ElementData = {
      element: 'form',
      attr: {
        id: 'form',
        action: '/auth/register',
        method: 'post',
      },
      children: [
        // CSRF
        {
          element: 'input',
          attr: {
            type: 'hidden',
            name: '_csrf',
            value: req.csrfToken?.() || '',
          },
        },
        // Email group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'email',
              },
              content: global.dictionary.form.email,
            },
            {
              element: 'input',
              attr: {
                type: 'email',
                name: 'email',
              },
            },
          ],
        },
        // Name group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'name',
              },
              content: global.dictionary.form.name,
            },
            {
              element: 'input',
              attr: {
                type: 'text',
                name: 'name',
              },
            },
          ],
        },
        // Password group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'password',
              },
              content: global.dictionary.form.password,
            },
            {
              element: 'input',
              attr: {
                type: 'password',
                name: 'password',
              },
            },
          ],
        },
        // Password confirmation group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'passwordConfirmation',
              },
              content: global.dictionary.form.passwordConfirmation,
            },
            {
              element: 'input',
              attr: {
                type: 'password',
                name: 'passwordConfirmation',
              },
            },
          ],
        },
        // Submit
        {
          element: 'div',
          children: [
            {
              element: 'button',
              attr: {
                type: 'submit',
              },
              content: global.dictionary.form.submit,
            },
          ],
        },
      ],
    }

    res.render('auth/register', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.registerPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      form: new RenderElement(form).toString(),
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

    SessionManger.generateAuthToken(res, user._id.toString())

    res.status(201).json({
      message: global.dictionary.messages.youHaveBeenRegisteredAndLoggedIn,
      redirect: '/',
    })
  })

  /**
   * Renders the login page
   */
  public loginPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const form: ElementData = {
      element: 'form',
      attr: {
        id: 'form',
        action: '/auth/login',
        method: 'post',
      },
      children: [
        // CSRF
        {
          element: 'input',
          attr: {
            type: 'hidden',
            name: '_csrf',
            value: req.csrfToken?.() || '',
          },
        },
        // Email group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'email',
              },
              content: global.dictionary.form.email,
            },
            {
              element: 'input',
              attr: {
                type: 'email',
                name: 'email',
              },
            },
          ],
        },
        // Password group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'password',
              },
              content: global.dictionary.form.password,
            },
            {
              element: 'input',
              attr: {
                type: 'password',
                name: 'password',
              },
            },
          ],
        },
        // Submit
        {
          element: 'div',
          children: [
            {
              element: 'button',
              attr: {
                type: 'submit',
              },
              content: global.dictionary.form.submit,
            },
          ],
        },
        // Forgot password
        {
          element: 'div',
          content: `<a href="/auth/forgot-password" class="link" data-link>${global.dictionary.navigation.forgotPasswordQ}</a>`,
        },
      ],
    }

    res.render('auth/login', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.loginPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      form: new RenderElement(form).toString(),
    })
  })

  /**
   * Authenticates a user
   */
  public loginUser = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password!))) {
      SessionManger.generateAuthToken(res, user._id.toString())

      res.status(200).json({
        message: global.dictionary.messages.youHaveBeenLoggedIn,
        redirect: '/',
      })
    } else {
      res.status(401)

      throw new Error(global.dictionary.messages.invalidCredentials)
    }
  })

  /**
   * Logs out a user by destroying the session and clearing the auth token
   * @param req
   * @param res
   */
  public logoutUser = (req: Request, res: Response) => {
    SessionManger.destroyUserSession(req, res)
  }

  /**
   * Forgot password page
   */
  public forgotPasswordPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const form: ElementData = {
      element: 'form',
      attr: {
        id: 'form',
        action: '/auth/forgot-password',
        method: 'post',
      },
      children: [
        // CSRF
        {
          element: 'input',
          attr: {
            type: 'hidden',
            name: '_csrf',
            value: req.csrfToken?.() || '',
          },
        },
        // Email group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'email',
              },
              content: global.dictionary.form.email,
            },
            {
              element: 'input',
              attr: {
                type: 'email',
                name: 'email',
              },
            },
          ],
        },
        // Submit
        {
          element: 'div',
          children: [
            {
              element: 'button',
              attr: {
                type: 'submit',
              },
              content: global.dictionary.form.submit,
            },
          ],
        },
      ],
    }

    res.render('auth/forgot', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.forgotPasswordPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      form: new RenderElement(form).toString(),
    })
  })

  /**
   * Authenticates a user
   */
  public forgotPasswordSendMail = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      res.status(400)

      throw new Error(global.dictionary.messages.emailNotExist)
    }

    // send mail

    res.status(200).json({
      message: global.dictionary.messages.emailSent,
    })
  })
}

export default new AuthController()
