import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import RenderElement, { ElementData } from '../lib/RenderElement'
import User from '../models/User'

/**
 * Controller class for handling profile-related operations
 */
class ProfileController {
  /**
   * Profile page
   */
  public profilePage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const user = req.session.user

    if (!user) {
      res.status(401)

      throw new Error(global.dictionary.messages.unauthorized)
    }

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

    res.render('profile/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.profilePage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      accountForm: new RenderElement(accountForm).toString(),
    })
  })

  /**
   * Account data change
   */
  public accountChange = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { name } = req.body

    if (!req.session.user) {
      res.status(401)

      throw new Error(global.dictionary.messages.unauthorized)
    }

    const user = await User.findByIdAndUpdate(req.session.user._id, { name }, { new: true })

    if (!user) {
      res.status(404)

      throw new Error(global.dictionary.messages.somethingWentWrong)
    }

    res.status(200).json({ message: global.dictionary.messages.saved })
  })
}

export default new ProfileController()
