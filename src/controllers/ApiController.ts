import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Mailer from '../lib/Mailer'

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

  /**
   * Contact us mail
   */
  public contactUsMail = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { email, message } = req.body

    await new Mailer().send({
      from: email,
      to: process.env.MAILER_FROM,
      subject: global.dictionary.pages.contactUs,
      text: message,
    })

    res.status(200).json({ message: global.dictionary.messages.emailSent })
  })
}

export default new ApiController()
