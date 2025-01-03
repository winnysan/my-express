import { NextFunction, Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Validator from '../lib/Validator'
import User from '../models/User'

/**
 * Middleware class for handling input validation
 */
class ValidationMiddleware {
  /**
   * Middleware function for validating registration data
   */
  public static register = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('name').required()

    validation.field('email').required().email().unique(User, 'email')

    validation.field('password').required().min(8)

    validation.field('passwordConfirmation').required().confirm('password')

    await validation.runValidations()

    if (validation.errors.length > 0) {
      res.json({ validation: validation.errors })
    } else {
      next()
    }
  })

  /**
   * Middleware function for validating login data
   */
  public static login = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('email').required().email()

    validation.field('password').required()

    await validation.runValidations()

    if (validation.errors.length > 0) {
      res.json({ validation: validation.errors })
    } else {
      next()
    }
  })
}

export default ValidationMiddleware
