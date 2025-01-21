import { Response } from 'express'
import mongoose from 'mongoose'
import { ICategory } from '../models/Category'
import { IUser } from '../models/User'
import { Role } from '../types/enums'
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
   * Validates if a value exists and throw a 404 error if it doesn't
   * @param condition
   * @param res
   * @param options
   */
  protected isExist<T>(
    condition: T | null | undefined,
    res: Response,
    options?: { statusCode?: number; message?: string }
  ): asserts condition is T {
    if (!condition) {
      res.status(options?.statusCode || 404)

      throw new Error(options?.message || global.dictionary.messages.somethingWentWrong)
    }
  }

  /**
   * Checks if the user is the owner of the resource or has admin privileges if allowed
   * @param user
   * @param compareId
   * @param res
   * @param options
   */
  protected isOwner(
    user: IUser | null | undefined,
    compareId: mongoose.Types.ObjectId,
    res: Response,
    options?: { statusCode?: number; message?: string; admin?: boolean }
  ): asserts user is IUser {
    const isOwner = user?._id.toString() === compareId.toString()
    const isAdmin = options?.admin && user?.role === Role.ADMIN

    if (!isOwner && !isAdmin) {
      res.status(options?.statusCode || 401)

      throw new Error(options?.message || global.dictionary.messages.unauthorized)
    }
  }

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
