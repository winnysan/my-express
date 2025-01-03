import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import AsyncHandler from '../lib/AsyncHandler'
import Message from '../lib/Message'
import User, { IUser } from '../models/User'

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
}

export default new AuthMiddleware()
