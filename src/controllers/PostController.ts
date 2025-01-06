import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Category, { ICategory } from '../models/Category'

/**
 * Controller class for handling post-related operations
 */
class PostController {
  /**
   * Posts page
   */
  public postsPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('post/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.postsPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
    })
  })

  /**
   * Posts page
   */
  public newPostPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const categories: ICategory[] = await Category.find({ locale: global.locale })

    res.render('post/new', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.newPostPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      categories,
    })
  })

  /**
   * Create a new post
   */
  public newPost = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { title, body, categories } = req.body

    console.log({ title, body, categories })

    res.status(201).json({
      message: 'ok',
    })
  })
}

export default new PostController()
