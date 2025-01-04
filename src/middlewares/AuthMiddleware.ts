import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import AsyncHandler from '../lib/AsyncHandler'
import Message from '../lib/Message'
import User, { IUser } from '../models/User'
import { Role } from '../types/enums'

type Decoded = {
  userId: string
  iat: number
  exp: number
}

/**
 * Middleware class for handling authentication and authorization in Express
 */
class AuthMiddleware {
  /**
   * Middleware to check id the user is authenicated by verifying the JWT token
   */
  public authCheck = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.authToken

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as Decoded
        req.session.user = (await User.findById(decoded.userId).select('-password')) as IUser

        next()
      } catch (err: unknown) {
        res.status(401)

        throw new Error(Message.getErrorMessage(err))
      }
    } else {
      req.session.user = undefined

      next()
    }
  })

  /**
   * Middleware to protect routes by ensuring the user is authenticated
   */
  public protect = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser | undefined = req.session.user

    if (user) {
      next()
    } else {
      res.redirect('/auth/login')
    }
  })

  /**
   * Middleware to allow access only to admin users
   */
  public admin = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user && req.session.user.role === Role.ADMIN) {
      next()
    } else {
      if (req.is('application/json')) {
        res.status(401).json({ message: global.dictionary.messages.unauthorized })
      } else {
        res.redirect('/')
      }
    }
  })

  /**
   * Middleware to allow access only to unauthenticated users
   */
  public public = AsyncHandler.wrap(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.authToken || !req.session.user) {
      next()
    } else {
      res.redirect('/')
    }
  })
}

export default new AuthMiddleware()
