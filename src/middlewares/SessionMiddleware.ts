import { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import BaseMiddleware from './BaseMiddleware'

/**
 * Middleware class to handle session management
 */
class SessionMiddleware extends BaseMiddleware {
  private sessionConfig = session({
    secret: process.env.SESSION_SECRET || 'session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })

  /**
   * Middleware logic to initailize session
   * @param req
   * @param res
   * @param next
   */
  protected handle(req: Request, res: Response, next: NextFunction): void {
    this.sessionConfig(req, res, next)
  }
}

export default new SessionMiddleware()
