import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

/**
 * Controller class for handling profile-related operations
 */
class ProfileController {
  /**
   * Profile page
   */
  public profilePage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('profile/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.profilePage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
    })
  })
}

export default new ProfileController()
