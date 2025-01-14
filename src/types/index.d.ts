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
      ADMIN_EMAIL?: string
      JWT_SECRET: string
      PER_PAGE: number
      MAILER_HOST: string
      MAILER_PORT: number
      MAILER_SECURE: string
      MAILER_USER?: string
      MAILER_PASSWORD?: string
      MAILER_FROM: string
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
