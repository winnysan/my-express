import { NextFunction, Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Validator from '../lib/Validator'
import User from '../models/User'
import { Mimetype } from '../types/enums'

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

  /**
   * Middleware function for validating post data
   */
  public static post = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('title').required()

    validation.field('body').required()

    validation
      .field('files')
      .mimetype([Mimetype.IMAGE_JPEG, Mimetype.IMAGE_PNG, Mimetype.IMAGE_AVIF, Mimetype.IMAGE_GIF])

    await validation.runValidations()

    if (validation.errors.length > 0) {
      res.json({ validation: validation.errors })
    } else {
      next()
    }
  })

  /**
   * Middleware function for validating forgot password data
   */
  public static forgot = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('email').required().email()

    await validation.runValidations()

    if (validation.errors.length > 0) {
      res.json({ validation: validation.errors })
    } else {
      next()
    }
  })

  /**
   * Middleware function for validating reset password data
   */
  public static reset = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('_token').required()

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
   * Middleware function for validating account data
   */
  public static account = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('name').required()

    await validation.runValidations()

    if (validation.errors.length > 0) {
      res.json({ validation: validation.errors })
    } else {
      next()
    }
  })

  /**
   * Middleware function for validating password data
   */
  public static password = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = new Validator(req)

    validation.field('old').required()

    validation.field('password').required().min(8)

    validation.field('passwordConfirmation').required().confirm('password')

    await validation.runValidations()

    if (validation.errors.length > 0) {
      res.json({ validation: validation.errors })
    } else {
      next()
    }
  })
}

export default ValidationMiddleware
