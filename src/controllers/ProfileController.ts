import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import RenderElement, { ElementData } from '../lib/RenderElement'
import SessionManger from '../lib/SesionManager'
import User from '../models/User'
import BaseController from './BaseController'

/**
 * Controller class for handling profile-related operations
 */
class ProfileController extends BaseController {
  /**
   * Profile page
   */
  public profilePage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const user = req.session.user

    this.isExist(user, res, { statusCode: 401, message: global.dictionary.messages.unauthorized })

    const accountForm: ElementData = {
      element: 'form',
      attr: {
        id: 'form-account',
        action: '/profile/account',
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
                value: user.email,
                disabled: true,
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
                value: user.name,
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

    const passwordForm: ElementData = {
      element: 'form',
      attr: {
        id: 'form-password',
        action: '/profile/password',
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
        // Old password group
        {
          element: 'div',
          children: [
            {
              element: 'label',
              attr: {
                for: 'password',
              },
              content: global.dictionary.form.oldPassword,
            },
            {
              element: 'input',
              attr: {
                type: 'password',
                name: 'old',
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
              content: global.dictionary.form.newPassword,
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
        // Info
        {
          element: 'p',
          content: global.dictionary.pages.logoutAfterPasswordChange,
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

    res.render('profile/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.profilePage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      accountForm: new RenderElement(accountForm).toString(),
      passwordForm: new RenderElement(passwordForm).toString(),
    })
  })

  /**
   * Account data change
   */
  public accountChange = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { name } = req.body

    this.isExist(req.session.user, res, { statusCode: 401, message: global.dictionary.messages.unauthorized })

    const user = await User.findByIdAndUpdate(req.session.user._id, { name }, { new: true })

    this.isExist(user, res, { statusCode: 400 })

    res.status(200).json({ message: global.dictionary.messages.saved })
  })

  /**
   * Password change
   */
  public passwordChange = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { old, password } = req.body

    this.isExist(req.session.user, res, { statusCode: 401, message: global.dictionary.messages.unauthorized })

    const user = await User.findById(req.session.user._id)

    this.isExist(user, res, { statusCode: 400, message: global.dictionary.messages.userNotExist })

    const isValid = await bcrypt.compare(old, user.password!)

    this.isExist(isValid, res, { statusCode: 401, message: global.dictionary.messages.invalidPassword })

    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10))
    await user.save()

    SessionManger.destroyUserSession(req, res, {
      message: global.dictionary.messages.passwordChangedAndLogout,
      redirect: '/auth/login',
    })
  })
}

export default new ProfileController()
