import { NextFunction, Request, Response } from 'express'

/**
 * A utility class for handling asynchronous route handlers and middleware
 */
class AsyncHandler {
  /**
   * Wraps an asynchronous function to handle errors automatically
   * @param fn
   * @returns A function that takes `req`, `res`, and `next` parameters and returns a promise
   */
  public wrap(fn: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }
}

export default new AsyncHandler()
