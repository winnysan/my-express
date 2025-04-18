import { Request, Response } from 'express'
import fs from 'fs-extra'
import mongoose from 'mongoose'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import AsyncHandler from '../lib/AsyncHandler'
import Helper from '../lib/Helper'
import Logger from '../lib/Logger'
import ProcessImage from '../lib/ProcessImage'
import Category, { ICategory } from '../models/Category'
import Post, { IPost } from '../models/Post'
import { IUser } from '../models/User'
import { ImageFormat } from '../types/enums'
import { locale } from '../types/locale'
import BaseController from './BaseController'

/**
 * Controller class for handling post-related operations
 */
class PostController extends BaseController {
  /**
   * Posts page with filtered posts
   */
  public postsPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { page, perpage, userpage, userperpage, categories, locales, author, sort, order, search } = req.query
    const query: Record<string, any> = {}

    /**
     * Validate and filter by categories
     */
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : (categories as string).split(',')
      const validCategories = categoryArray.filter(category => mongoose.Types.ObjectId.isValid(category as string))
      if (validCategories.length > 0) query.categories = { $in: validCategories }
    }

    /**
     * Validate and filter by author
     */
    if (author && mongoose.Types.ObjectId.isValid(author as string)) {
      query.author = author
    }

    /**
     * Filter by locales
     */
    if (locales) {
      const localeArray = Array.isArray(locales) ? locales : (locales as string).split(',')
      query.locale = { $in: localeArray }
    } else {
      query.locale = global.locale
    }

    /**
     * Search filter - diacritics insensitive
     */
    if (search) {
      const searchRegex = Helper.diacriticsInsensitiveRegex(search as string)
      query.$or = [{ title: { $regex: searchRegex, $options: 'i' } }, { body: { $regex: searchRegex, $options: 'i' } }]
    }

    /**
     * Pagination and sorting
     */
    const pageNumber = parseInt(page as string, 10) || 1
    const perPageNumber = parseInt(perpage as string, 10) || process.env.PER_PAGE
    const userPageNumber = parseInt(userpage as string, 10) || 1
    const userPerPageNumber = parseInt(userperpage as string, 10) || 10
    const sortOrder = order === 'desc' ? 1 : -1
    const allowedSortFields = ['createdAt', 'updatedAt', 'title']
    const sortField = sort && allowedSortFields.includes(sort as string) ? sort : 'createdAt'
    const allowedOrderFields = ['asc', 'desc']

    /**
     * Fill query-related arrays for rendering
     */
    const queryCategories = categories
      ? Array.isArray(categories)
        ? categories.filter(category => mongoose.Types.ObjectId.isValid(category as string))
        : (categories as string).split(',').filter(category => mongoose.Types.ObjectId.isValid(category))
      : []
    const queryAuthor = author && mongoose.Types.ObjectId.isValid(author as string) ? (author as string) : ''
    const queryLocales = locales ? (Array.isArray(locales) ? locales : (locales as string).split(',')) : [global.locale]
    const querySearch = search ? (search as string) : ''
    const querySortBy = sort && allowedSortFields.includes(sort as string) ? sort : 'createdAt'
    const queryOrderBy = order && allowedOrderFields.includes(order as string) ? order : 'asc'
    const queryPerPage = String(perPageNumber)

    /**
     * Execute query for posts
     */
    const postsPromise = Post.find(query)
      .populate('author', 'name')
      .sort({ [sortField as string]: sortOrder })
      .skip((pageNumber - 1) * perPageNumber)
      .limit(perPageNumber)
    const totalPostsPromise = Post.countDocuments(query)

    /**
     * Fetch categories
     */
    const allCategoriesPromise = Category.aggregate([
      {
        $match: {
          parent_id: null,
        },
      },
      {
        $graphLookup: {
          from: 'categories',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent_id',
          as: 'subcategories',
        },
      },
      {
        $group: {
          _id: '$locale',
          records: {
            $push: {
              _id: '$_id',
              name: '$name',
              parent_id: '$parent_id',
              subcategories: '$subcategories',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          locale: '$_id',
          records: 1,
        },
      },
    ])

    /**
     * Fetch authors with post counts
     */
    const authorsPromise = Post.aggregate([
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'authorDetails' } },
      { $unwind: '$authorDetails' },
      { $project: { _id: 1, postCount: 1, 'authorDetails.name': 1, 'authorDetails.email': 1 } },
    ])

    /**
     * Fetch posts by a verified user
     */
    const user: IUser | undefined = req.session.user
    const userPostsPromise = user
      ? Post.find({ author: user._id })
          .sort({ createdAt: -1 })
          .skip((userPageNumber - 1) * userPerPageNumber)
          .limit(userPerPageNumber)
      : Promise.resolve([])

    const totalUserPostsPromise = user ? Post.countDocuments({ author: user._id }) : Promise.resolve(0)

    /**
     * Await all promises
     */
    const [posts, totalPosts, allCategories, authors, userPosts, totalUserPosts] = await Promise.all([
      postsPromise,
      totalPostsPromise,
      allCategoriesPromise,
      authorsPromise,
      userPostsPromise,
      totalUserPostsPromise,
    ])

    /**
     * Sort categories by order and locale
     */
    allCategories.forEach(group => {
      // @ts-ignore
      group.records.forEach(record => {
        if (record.subcategories) {
          // @ts-ignore
          record.subcategories.sort((a, b) => a.order - b.order)
        }
      })
    })
    const sortedCategories = [
      ...allCategories.filter(group => group.locale === global.locale),
      ...allCategories.filter(group => group.locale !== global.locale),
    ]

    /**
     * Prioritize locales by global locale
     */
    const prioritizedLocales = [global.locale, ...locale.locales.filter(locale => locale !== global.locale)]

    const postsMeta = {
      total: totalPosts,
      page: pageNumber,
      perpage: perPageNumber,
      totalPages: Math.ceil(totalPosts / perPageNumber),
    }

    const userPostsMeta = {
      total: totalUserPosts,
      page: userPageNumber,
      perpage: userPerPageNumber,
      totalPages: Math.ceil(totalUserPosts / userPerPageNumber),
    }

    res.render('post/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.postsPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      posts,
      userPosts,
      categories: sortedCategories,
      authors,
      locales: prioritizedLocales,
      queryCategories,
      queryAuthor,
      queryLocales,
      querySearch,
      querySortBy,
      queryOrderBy,
      queryPerPage,
      postsMeta,
      userPostsMeta,
      query: req.query,
      generatePaginationUrl: (page: number) => this.generatePaginationUrl('/posts', page, req.query),
      generateUserPaginationUrl: (page: number) =>
        this.generatePaginationUrl('/posts', undefined, { ...req.query, userpage: page }),
    })
  })

  /**
   * Posts page
   */
  public newPostPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const categories: ICategory[] = await Category.find({ locale: global.locale })

    res.render('post/new', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.newPostPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      categories,
    })
  })

  /**
   * Creates a new post in the database
   */
  public newPost = AsyncHandler.wrap(async (req: Request, res: Response) => {
    let { title, body, categories } = req.body

    const images = req.files
      ? await Promise.all(
          (req.files as Express.Multer.File[]).map(async file => {
            const originalname = file.originalname
            const uuid = uuidv4()

            file = await new ProcessImage(file)
              .resize({ width: 600, height: 600, fit: 'inside' })
              .convert({ format: ImageFormat.AVIF, quality: 50 })
              .save()

            const extension = path.extname(file.originalname)
            const filename = `${uuid}${extension}`
            const targetPath = path.join('uploads/', filename)
            const thumbPath = path.join('uploads/thumbs/', filename)

            await new ProcessImage(file)
              .resize({ width: 100, height: 100, crop: true })
              .convert({ quality: 60 })
              .saveAs(thumbPath)

            await fs.move(file.path, targetPath)

            const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${originalname}\\)`, 'g')
            const imageUrl = `/uploads/${filename}`
            body = body.replace(regex, `![$1](${imageUrl})`)

            return {
              originalname,
              uuid,
              extension,
              mime: file.mimetype,
              size: file.size,
              createdAt: new Date(),
            }
          })
        )
      : []

    const post = await Post.create({
      author: req.session.user!._id,
      title,
      body,
      slug: `${Helper.slugify(title)}-${Date.now()}`,
      images,
      categories,
      locale: global.locale,
    })

    res.status(201).json({
      message: global.dictionary.messages.postCreated,
      redirect: `/posts/${post.slug}`,
    })
  })

  /**
   * Edits an existing post in the database
   */
  public editPost = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id)

    this.isExist(post, res, { statusCode: 400 })

    this.isOwner(req.session.user, post.author._id, res, { admin: true })

    let { title, body, categories } = req.body

    const usedImageUrls = new Set<string>()
    const imageMarkdownRegex = /!\[[^\]]*\]\(([^)]+)\)/g
    let match

    while ((match = imageMarkdownRegex.exec(body)) !== null) {
      const imageUrl = match[1]

      if (imageUrl) usedImageUrls.add(imageUrl)
    }

    const newImages = req.files
      ? await Promise.all(
          (req.files as Express.Multer.File[]).map(async file => {
            const originalname = file.originalname
            const uuid = uuidv4()

            file = await new ProcessImage(file)
              .resize({ width: 600, height: 600, fit: 'inside' })
              .convert({ format: ImageFormat.AVIF, quality: 50 })
              .save()

            const extension = path.extname(file.originalname)
            const filename = `${uuid}${extension}`
            const targetPath = path.join('uploads/', filename)
            const thumbPath = path.join('uploads/thumbs/', filename)

            await new ProcessImage(file)
              .resize({ width: 300, height: 300, crop: true })
              .convert({ quality: 60 })
              .saveAs(thumbPath)

            await fs.move(file.path, targetPath)

            const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${originalname}\\)`, 'g')
            const imageUrl = `/uploads/${filename}`
            body = body.replace(regex, `![$1](${imageUrl})`)

            usedImageUrls.add(imageUrl)

            return {
              originalname,
              uuid,
              extension,
              mime: file.mimetype,
              size: file.size,
              createdAt: new Date(),
            }
          })
        )
      : []

    const updatedImages = []

    for (const image of post.images) {
      const imageUrl = `/uploads/${image.uuid}${image.extension}`

      if (usedImageUrls.has(imageUrl)) {
        updatedImages.push(image)
      } else {
        const filePath = path.join('uploads/', image.uuid + image.extension)
        const filePathThumb = path.join('uploads/thumbs/', image.uuid + image.extension)

        try {
          await fs.unlink(filePath)
          await fs.unlink(filePathThumb)
        } catch (err) {
          Logger.logToFile(err)
        }
      }
    }

    updatedImages.push(...newImages)

    post.title = title
    post.body = body
    post.images = updatedImages
    post.categories = categories

    await post.save()

    res.status(200).json({ message: global.dictionary.messages.postEdited })
  })

  /**
   * Retrieves a post by its slug and renders it in the response
   */
  public getPostBySlug = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const post: IPost | null = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name')
      .populate('categories', 'name')

    this.isExist(post, res, { message: `${req.originalUrl} ${global.dictionary.messages.notFound}` })

    if (post.author._id.toString() !== req.session.user?._id.toString()) {
      post.views += 1
      await post.save()
    }

    const isAuthor = req.session.user ? req.session.user._id.equals(post.author._id) : false

    let categories: ICategory[] = []

    if (isAuthor) categories = await Category.find({ locale: post.locale })

    res.render('post/show', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: post.title,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
      post,
      article: Helper.parseBody(post.body),
      isAuthor,
      categories,
    })
  })
}

export default new PostController()
