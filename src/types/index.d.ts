declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: number
    }
  }
}

export {}
