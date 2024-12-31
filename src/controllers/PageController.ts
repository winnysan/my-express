import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

/**
 * Controller class for handling pages operations
 */
class PageController {
  /**
   * Home page
   */
  public home = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.homePage,
    })
  })
}

export default new PageController()
