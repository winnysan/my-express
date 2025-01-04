import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Category, { ICategory } from '../models/Category'

type CategoryList = {
  id: string
  name: string
  order: number
  children: CategoryList[]
}

/**
 * Controller class for handling admin-related operations
 */
class AdminController {
  /**
   * Admin page
   */
  public adminPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const categories = await Category.find()

    res.render('admin/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.adminPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      categories: this.nestedCategories(categories),
    })
  })

  /**
   * Recursively organizes categories into a nested structure
   * @param categories
   * @param parentId
   * @returns
   */
  private nestedCategories(categories: ICategory[], parentId: string | null = null): any {
    const categoryList: CategoryList[] = []
    let category: ICategory[]

    if (parentId == null) category = categories.filter(category => category.parent_id == null)
    else category = categories.filter(category => String(category.parent_id) == String(parentId))

    for (let c of category) {
      categoryList.push({
        id: c._id.toString(),
        name: c.name,
        order: c.order,
        children: this.nestedCategories(categories, c._id.toString()),
      })
    }
    return categoryList
  }
}

export default new AdminController()
