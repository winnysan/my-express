import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Category from '../models/Category'
import Post from '../models/Post'
import { locale } from '../types/locale'
import BaseController from './BaseController'

/**
 * Controller class for handling admin-related operations
 */
class AdminController extends BaseController {
  /**
   * Admin page
   */
  public adminPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { page, perpage } = req.query

    const pageNumber = parseInt(page as string, 10) || 1
    const perPageNumber = parseInt(perpage as string, 10) || 10

    const categoriesPromise = Category.find()

    const postsPromise = Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * perPageNumber)
      .limit(perPageNumber)

    const totalPostsPromise = Post.countDocuments()

    const [categories, posts, totalPosts] = await Promise.all([categoriesPromise, postsPromise, totalPostsPromise])

    const postsMeta = {
      total: totalPosts,
      page: pageNumber,
      perpage: perPageNumber,
      totalPages: Math.ceil(totalPosts / perPageNumber),
    }

    res.render('admin/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.adminPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      categories: this.nestedCategories(categories),
      posts,
      postsMeta,
      locales: locale.locales,
      generatePaginationUrl: (page: number) => this.generatePaginationUrl('/admin', page, req.query),
    })
  })
}

export default new AdminController()
