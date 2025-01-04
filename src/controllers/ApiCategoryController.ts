import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

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

    return res.status(200).json({ message: 'OK', data })
  })
}

export default new ApiCategoryController()
