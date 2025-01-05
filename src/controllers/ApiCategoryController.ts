import { Request, Response } from 'express'
import mongoose from 'mongoose'
import AsyncHandler from '../lib/AsyncHandler'
import Category from '../models/Category'
import { CategoryAction } from '../types/enums'

type ReceiveData = {
  action: string
  id?: string
  value?: string
}

type ResponseData = {
  message: string
  status?: number
  newId?: string
}

/**
 * Api controller class for handling category-related operations
 */
class ApiCategoryController {
  /**
   * Handle POST requests for category operation
   */
  public categoriesPost = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { data } = req.body

    if (!data || !data.action) return res.status(400).json({ message: global.dictionary.messages.invalidData })

    const action = data.action
    let responseData: ResponseData = { message: '' }

    switch (action) {
      case CategoryAction.ADD_FIRST:
        responseData = await this.addFirstCategory(data)
        break
      case CategoryAction.ADD:
        responseData = await this.addCategory(data)
        break
      case CategoryAction.ADD_NESTED:
        responseData = await this.addNestedCategory(data)
        break
      case CategoryAction.DELETE:
        responseData = await this.deleteCategory(data)
        break
      case CategoryAction.UP:
        responseData = await this.moveUpCategory(data)
        break
      case CategoryAction.DOWN:
        responseData = await this.moveDownCategory(data)
        break
      case CategoryAction.RENAME:
        responseData = await this.renameCategory(data)
        break
      case CategoryAction.SET_LOCALE:
        responseData = await this.setLocaleCategory(data)
        break

      default:
        return res.status(400).json({ message: global.dictionary.messages.unknownAction })
    }

    return res.status(200).json(responseData)
  })

  /**
   * Adds the first category
   * @param data
   * @returns
   */
  private async addFirstCategory(data: ReceiveData): Promise<ResponseData> {
    const topCategories = await Category.find({ parent_id: null }).sort({ order: -1 }).limit(1)
    const nextOrderFirst = topCategories.length > 0 ? topCategories[0].order + 1 : 1

    const newFirstCategory = new Category({
      name: global.dictionary.categories.new,
      order: nextOrderFirst,
    })

    const savedFirstCategory = await newFirstCategory.save()

    return { message: global.dictionary.categories.firstCategoryCreated, newId: savedFirstCategory._id.toString() }
  }

  /**
   * Add a category after a specifid category
   * @param data
   * @returns
   */
  private async addCategory(data: ReceiveData): Promise<ResponseData> {
    if (!data.id) return { message: global.dictionary.categories.missingCatedoryIdToAddAfter, status: 400 }

    const afterCategory = await Category.findById(data.id)
    if (!afterCategory) return { message: global.dictionary.categories.categoryNotFound, status: 404 }

    const parentId = afterCategory.parent_id
    const nextOrderAdd = afterCategory.order + 1

    await Category.updateMany({ parent_id: parentId, order: { $gte: nextOrderAdd } }, { $inc: { order: 1 } })

    const newCategory = new Category({
      name: global.dictionary.categories.new,
      parent_id: parentId,
      order: nextOrderAdd,
    })

    const savedCategory = await newCategory.save()

    return { message: global.dictionary.categories.categoryCreated, newId: savedCategory._id.toString() }
  }

  /**
   * Adds a nested category under a specified parent category
   * @param data
   */
  private async addNestedCategory(data: ReceiveData): Promise<ResponseData> {
    if (!data.id) return { message: global.dictionary.categories.missingParentCategoryId, status: 400 }

    const parentCategory = await Category.findById(data.id)
    if (!parentCategory) return { message: global.dictionary.categories.parentCategoryNotFound, status: 404 }

    const childCategories = await Category.find({ parent_id: parentCategory._id }).sort({ order: -1 }).limit(1)
    const nextOrderNested = childCategories.length > 0 ? childCategories[0].order + 1 : 1

    const newNestedCategory = new Category({
      name: global.dictionary.categories.new,
      parent_id: parentCategory._id,
      order: nextOrderNested,
    })

    const savedNestedCategory = await newNestedCategory.save()

    return { message: global.dictionary.categories.nestedCategoryCreated, newId: savedNestedCategory._id.toString() }
  }

  /**
   * Deletes a category and its subcategories
   * @param data
   * @returns
   */
  private async deleteCategory(data: ReceiveData) {
    if (!data.id) return { message: global.dictionary.categories.missingCategoryIdToDelete, status: 400 }

    const deleteCategory = await Category.findById(data.id)
    if (!deleteCategory) return { message: global.dictionary.categories.categoryNotFound, status: 404 }

    const deleteCategoryAndChildren = async (id: mongoose.Types.ObjectId): Promise<void> => {
      const children = await Category.find({ parent_id: id })

      for (const child of children) {
        await deleteCategoryAndChildren(child._id)
      }

      await Category.findByIdAndDelete(id)
    }

    await deleteCategoryAndChildren(deleteCategory._id)

    await Category.updateMany(
      { parent_id: deleteCategory.parent_id, order: { $gt: deleteCategory.order } },
      { $inc: { order: -1 } }
    )

    return { message: global.dictionary.categories.categoryDeleted }
  }

  /**
   * Moves a category up in the list
   * @param data
   * @returns
   */
  private async moveUpCategory(data: ReceiveData): Promise<ResponseData> {
    if (!data.id) return { message: global.dictionary.categories.missingCategoryIdToMoveUp, status: 400 }

    const categoryUp = await Category.findById(data.id)
    if (!categoryUp) return { message: global.dictionary.categories.categoryNotFound, status: 404 }

    if (categoryUp.order === 1) return { message: global.dictionary.categories.categoryIsAlreadyAtTheTop, status: 400 }

    const previouCategory = await Category.findOne({
      parent_id: categoryUp.parent_id,
      order: categoryUp.order - 1,
    })

    if (!previouCategory) return { message: global.dictionary.categories.previousCategoryNotFound, status: 404 }

    categoryUp.order -= 1
    previouCategory.order += 1

    await categoryUp.save()
    await previouCategory.save()

    return { message: global.dictionary.categories.categoryMovedUp }
  }

  /**
   * Moves a category down in the list
   * @param data
   * @returns
   */
  private async moveDownCategory(data: ReceiveData): Promise<ResponseData> {
    if (!data.id) return { message: global.dictionary.categories.missingCategoryIdToMoveDown, status: 400 }

    const categoryDown = await Category.findById(data.id)
    if (!categoryDown) return { message: global.dictionary.categories.categoryNotFound, status: 404 }

    const maxOrder = await Category.find({ parent_id: categoryDown.parent_id })
      .sort({ order: -1 })
      .limit(1)
      .select('order')

    if (maxOrder.length === 0) return { message: global.dictionary.categories.noCategoryToMoveDown, status: 400 }

    if (categoryDown.order === maxOrder[0].order)
      return { message: global.dictionary.categories.categoryIsAlreadyAtTheEnd, status: 400 }

    const nextCategory = await Category.findOne({
      parent_id: categoryDown.parent_id,
      order: categoryDown.order + 1,
    })

    if (!nextCategory) return { message: global.dictionary.categories.nextCategoryNotFound, status: 404 }

    categoryDown.order += 1
    nextCategory.order -= 1

    await categoryDown.save()
    await nextCategory.save()

    return { message: global.dictionary.categories.categoryMovedDown }
  }

  /**
   * Updates the name of a category
   * @param data
   * @returns
   */
  private async renameCategory(data: ReceiveData): Promise<ResponseData> {
    if (!data.id || typeof data.value !== 'string')
      return { message: global.dictionary.messages.invalidDataForUpdate, status: 400 }

    const updatedCategory = await Category.findByIdAndUpdate(data.id, { name: data.value }, { new: true })

    if (!updatedCategory) return { message: global.dictionary.categories.categoryNotFound, status: 404 }

    return { message: global.dictionary.categories.categoryRenamed }
  }

  /**
   * Set the locale of category
   * @param data
   * @returns
   */
  private async setLocaleCategory(data: ReceiveData): Promise<ResponseData> {
    if (!data.id || typeof data.value !== 'string')
      return { message: global.dictionary.messages.invalidDataForUpdate, status: 400 }

    const updatedCategory = await Category.findByIdAndUpdate(data.id, { locale: data.value }, { new: true })

    if (!updatedCategory) return { message: global.dictionary.categories.categoryNotFound, status: 404 }

    return { message: global.dictionary.categories.categoryLocaleUpdated }
  }
}

export default new ApiCategoryController()
