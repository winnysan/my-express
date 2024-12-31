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
    res.render('post/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.postsPage,
    })
  })
}

export default new PostController()
