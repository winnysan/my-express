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
    res.render('index')
  })
}

export default new PageController()
