import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'

/**
 * Controller class for handling api-related operations
 */
class ApiController {
  /**
   * CSRF token
   */
  public getCsrfToken = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const csrfToken = req.csrfToken?.()

    if (csrfToken) {
      res.json({ csrfToken })
    } else {
      res.json({ message: global.dictionary.messages.csrfTokenNotAvailable })
    }
  })
}

export default new ApiController()
