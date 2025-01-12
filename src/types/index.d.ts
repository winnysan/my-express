import { IUser } from '../models/User'
import { Dictionary } from './dictionary'
import { NodeEnv } from './enums'
import { Locale } from './locale'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: NodeEnv.PROD | NodeEnv.DEV
      PORT: number
      SESSION_SECRET: string
      MONGO_URI: string
      ADMIN_EMAIL: string | undefined
      JWT_SECRET: string
      PER_PAGE: number
    }
  }
  namespace Express {
    export interface Request {
      csrfToken?: () => string
    }
  }
  var locale: Locale
  var dictionary: Dictionary
}

declare module 'express-session' {
  export interface SessionData {
    user?: IUser
  }
}

export {}
