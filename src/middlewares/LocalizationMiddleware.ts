import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import { Domain } from '../types/enums'
import { locale } from '../types/locale'
import BaseMiddleware from './BaseMiddleware'

/**
 * Middleware class for handling localization based in the request's domain
 */
class LocalizationMiddleware extends BaseMiddleware {
  /**
   * Middleware function to determine the locale based on the request domain and load the corresponding localization file
   * @param req
   * @param res
   * @param next
   */
  protected handle(req: Request, res: Response, next: NextFunction): void {
    const host = req.get('host')

    const domain =
      host
        ?.replace(/(:\d+)?$/, '')
        .split('.')
        .pop() || null

    let file

    if (domain === Domain.SK) {
      file = `./src/dictionaries/${locale.locales[1]}.json`
      global.locale = locale.locales[1]
    } else {
      file = `./src/dictionaries/${locale.locales[0]}.json`
      global.locale = locale.locales[0]
    }

    if (file) {
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
          throw new Error('Error loading language file')
        } else {
          global.dictionary = JSON.parse(data)

          next()
        }
      })
    } else {
      throw new Error('Error determining the language file')
    }
  }
}

export default new LocalizationMiddleware()
