import { NextFunction, Request, Response } from 'express'
import Icon from '../lib/Icon'
import BaseMiddleware from './BaseMiddleware'

/**
 * Middleware for adding the Icon class to the response locals
 */
class IconMiddleware extends BaseMiddleware {
  /**
   * Adds the Icon class to ref.locals for use in views
   * @param req
   * @param res
   * @param next
   */
  protected handle(req: Request, res: Response, next: NextFunction): void {
    res.locals.Icon = Icon

    next()
  }
}

export default new IconMiddleware()
