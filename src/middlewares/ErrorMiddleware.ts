import { NextFunction, Request, Response } from 'express'
import Logger from '../lib/Logger'
import Message from '../lib/Message'
import { NodeEnv } from '../types/enums'
import BaseMiddleware from './BaseMiddleware'

class ErrorMiddleware extends BaseMiddleware {
  /**
   * Middleware for handling 404 Not Found errors, this middleware is called when no route matches the request
   * @param req
   * @param res
   * @param next
   */
  public notFound(req: Request, res: Response, next: NextFunction): void {
    const error = new Error(`${req.originalUrl} ${global.dictionary.messages.notFound}`)

    res.status(404)

    next(error)
  }

  /**
   * Middleware for handling errors that occur during request processing
   * @param err
   * @param req
   * @param res
   * @param next
   */
  public errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    const message = Message.getErrorMessage(err)
    const error = {
      message,
      name: err.name,
      code: res.statusCode !== 200 ? res.statusCode : 500,
      stack: err.stack,
    }

    Logger.logToFile(error)

    if (process.env.NODE_ENV === NodeEnv.PROD) {
      error.message = global.dictionary.messages.somethingWentWrong
      error.stack = undefined
    }

    if (res.statusCode === 404) {
      res.render('error', {
        layout: res.locals.isAjax ? false : 'layouts/main',
        title: global.dictionary.title.errorPage,
        csrfToken: req.csrfToken?.() || '',
        user: req.session.user,
        error,
      })
    } else {
      res.status(res.statusCode !== 200 ? res.statusCode : 500).json({ error })
    }
  }
}

export default new ErrorMiddleware()
