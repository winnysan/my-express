import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

/**
 * Controller class for handling admin-related operations
 */
class AdminController {
  /**
   * Admin page
   */
  public adminPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('admin/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.adminPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      categories: [],
    })
  })
}

export default new AdminController()
