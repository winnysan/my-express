import { Response } from 'express'
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
}

export default SessionManger
