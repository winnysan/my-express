import { ICategory } from '../models/Category'
import { Locale } from '../types/locale'

type CategoryList = {
  id: string
  name: string
  order: number
  locale: Locale
  children: CategoryList[]
}

/**
 * Base controller class to provide a standardized structure for controllers
 */
class BaseController {
  /**
   * Generate a pagination URL
   * @param baseUrl
   * @param page
   * @param query
   */
  protected generatePaginationUrl(baseUrl: string, page: number | undefined, query: Record<string, any>): string {
    const queryParams = new URLSearchParams(query)

    if (page) queryParams.set('page', page.toString())

    return `${baseUrl}?${queryParams.toString()}`
  }

  /**
   * Recursively organizes categories into a nested structure
   * @param categories
   * @param parentId
   * @returns
   */
  protected nestedCategories(categories: ICategory[], parentId: string | null = null): any {
    const categoryList: CategoryList[] = []
    let category: ICategory[]

    if (parentId == null) category = categories.filter(category => category.parent_id == null)
    else category = categories.filter(category => String(category.parent_id) == String(parentId))

    for (let c of category) {
      categoryList.push({
        id: c._id.toString(),
        name: c.name,
        order: c.order,
        locale: c.locale,
        children: this.nestedCategories(categories, c._id.toString()),
      })
    }
    return categoryList
  }
}

export default BaseController
