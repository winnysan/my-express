import { NextFunction, Request, Response } from 'express'
import BaseMiddleware from './BaseMiddleware'

/**
 * Middleware class for detecting AJAX requests
 */
class AjaxMiddleware extends BaseMiddleware {
  /**
   * Middleware to check if the request is an AJAX request
   * @param req
   * @param res
   * @param next
   */
  protected handle(req: Request, res: Response, next: NextFunction): void {
    res.locals.isAjax = req.xhr

    next()
  }
}

export default new AjaxMiddleware()
