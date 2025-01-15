import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { NodeEnv } from '../types/enums'

/**
 * Manages user sessions, including generating and destroying authentication tokens
 */
class SessionManger {
  /**
   * Generates an authentication token and sets it as a cookie in the response
   * @param res
   * @param userId
   */
  public static generateAuthToken(res: Response, userId: string): void {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NodeEnv.PROD,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  }

  /**
   * Destroys the user's session by clearing the authentication cookie and removing the user from the session
   * @param req
   * @param res
   * @param options
   */
  public static destroyUserSession(
    req: Request,
    res: Response,
    options?: { message?: string; redirect?: string }
  ): void {
    res.cookie('authToken', '', {
      httpOnly: true,
      expires: new Date(0),
    })

    delete req.session.user

    res.status(200).json({
      message: options?.message || global.dictionary.messages.youHaveBeenLoggedOut,
      redirect: options?.redirect || '/',
    })
  }
}

export default SessionManger
