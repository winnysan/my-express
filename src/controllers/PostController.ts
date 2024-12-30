import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

/**
 * Controller class for handling post-related operations
 */
class PostController {
  /**
   * Posts page
   */
  public getPosts = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('post/index')
  })
}

export default new PostController()
