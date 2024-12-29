import { NodeEnv } from './enums'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: NodeEnv.PROD | NodeEnv.DEV
      PORT: number
    }
  }
}

export {}
