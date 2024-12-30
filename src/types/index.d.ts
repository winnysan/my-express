import { Dictionary } from './dictionary'
import { NodeEnv } from './enums'
import { Locale } from './locale'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: NodeEnv.PROD | NodeEnv.DEV
      PORT: number
    }
  }
  var locale: Locale
  var dictionary: Dictionary
}

export {}
