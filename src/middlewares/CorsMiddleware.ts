import cors, { CorsOptions } from 'cors'
import { NextFunction, Request, Response } from 'express'
import BaseMiddleware from './BaseMiddleware'

/**
 * Middleware class to handle CORS configuration
 */
class CorsMiddleware extends BaseMiddleware {
  private corsConfig: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }

  private corsHandler = cors(this.corsConfig)

  /**
   * Middleware logic to apply CORS settings
   * @param req
   * @param res
   * @param next
   */
  protected handle(req: Request, res: Response, next: NextFunction): void {
    this.corsHandler(req, res, next)
  }
}

export default new CorsMiddleware()
