import { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Base middleware class to provide a standardized structure for Express middleware
 */
abstract class BaseMiddleware {
  /**
   * Handles the middleware logic, to be implemented by subclasses
   * @param req
   * @param res
   * @param next
   */
  protected handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Promise<void> {
    next()
  }

  /**
   * Prepares the middleware to be used by Express
   */
  public use(): RequestHandler {
    return this.handle.bind(this)
  }
}

export default BaseMiddleware
