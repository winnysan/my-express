import { NextFunction, Request, RequestHandler, Response } from 'express'
import lusca from 'lusca'

/**
 * Middleware for CSRF protection
 */
class CsrfMiddleware {
  /**
   * Initializes and returns an array of middleware functions for CSRF protection
   * @returns
   */
  public static init(): Array<RequestHandler> {
    return [
      lusca.csrf(),
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.csrf = req.csrfToken?.()

        next()
      },
    ]
  }
}

export default CsrfMiddleware
