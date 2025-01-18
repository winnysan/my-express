import { Request, Response } from 'express'
import { Date, ObjectId } from 'mongoose'
import AsyncHandler from '../lib/AsyncHandler'
import Post from '../models/Post'
import { Locale } from '../types/locale'

type Post = {
  _id: ObjectId
  title: string
  slug: string
  images: string[]
  author: string
  likes: number
  views: number
  createdAt: Date
}

type Posts = {
  locale: Locale
  latest: Post[]
  top: Post[]
  anotherLocale: [
    {
      locale: Locale
      latest: Post[]
    }
  ]
}

/**
 * Controller class for handling pages operations
 */
class PageController {
  /**
   * Home page
   */
  public home = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const posts: Posts = (
      await Post.aggregate([
        {
          $facet: {
            globalLocaleLatest: [
              { $match: { locale: global.locale } },
              { $sort: { createdAt: -1 } },
              { $limit: 10 },
              {
                $lookup: {
                  from: 'users',
                  localField: 'author',
                  foreignField: '_id',
                  as: 'author',
                },
              },
              { $unwind: '$author' },
              {
                $project: {
                  title: 1,
                  slug: 1,
                  images: 1,
                  author: '$author.name',
                  likes: { $size: { $ifNull: ['$likes', []] } },
                  views: { $ifNull: ['$views', 0] },
                  createdAt: 1,
                },
              },
            ],
            globalLocaleTop: [
              { $match: { locale: global.locale } },
              { $sort: { likes: -1 } },
              { $limit: 5 },
              {
                $lookup: {
                  from: 'users',
                  localField: 'author',
                  foreignField: '_id',
                  as: 'author',
                },
              },
              { $unwind: '$author' },
              {
                $project: {
                  title: 1,
                  slug: 1,
                  images: 1,
                  author: '$author.name',
                  likes: { $size: '$likes' },
                  views: { $ifNull: ['$views', 0] },
                  createdAt: 1,
                },
              },
            ],
            otherLocales: [
              { $match: { locale: { $ne: global.locale } } },
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              {
                $lookup: {
                  from: 'users',
                  localField: 'author',
                  foreignField: '_id',
                  as: 'author',
                },
              },
              { $unwind: '$author' },
              {
                $group: {
                  _id: '$locale',
                  latest: {
                    $push: {
                      _id: '$_id',
                      title: '$title',
                      slug: '$slug',
                      images: '$images',
                      author: '$author.name',
                      likes: { $size: { $ifNull: ['$likes', []] } },
                      views: { $ifNull: ['$views', 0] },
                      createdAt: '$createdAt',
                    },
                  },
                },
              },
              {
                $project: {
                  locale: '$_id',
                  latest: '$latest',
                },
              },
            ],
          },
        },
        {
          $project: {
            locale: global.locale,
            latest: '$globalLocaleLatest',
            top: '$globalLocaleTop',
            anotherLocale: '$otherLocales',
          },
        },
      ])
    )[0]

    res.render('index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.homePage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      posts,
    })
  })
}

export default new PageController()
