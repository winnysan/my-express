import { Request, Response } from 'express'
import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import AsyncHandler from '../lib/AsyncHandler'
import Helper from '../lib/Helper'
import Logger from '../lib/Logger'
import ProcessImage from '../lib/ProcessImage'
import Category, { ICategory } from '../models/Category'
import Post, { IPost } from '../models/Post'
import { ImageFormat, Role } from '../types/enums'

/**
 * Controller class for handling post-related operations
 */
class PostController {
  /**
   * Posts page
   */
  public postsPage = AsyncHandler.wrap(async (req: Request, res: Response) => {
    res.render('post/index', {
      layout: res.locals.isAjax ? false : 'layouts/main',
      title: global.dictionary.title.postsPage,
      csrfToken: req.csrfToken?.() || '',
      user: req.session.user,
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

    if (!post) {
      res.status(404)

      throw new Error(`${req.originalUrl} ${global.dictionary.messages.notFound}`)
    }

    if (post.author._id.toString() !== req.session.user?._id.toString()) {
      if (req.session.user?.role !== Role.ADMIN) {
        res.status(401)

        throw new Error(global.dictionary.messages.unauthorized)
      }
    }

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
              .resize({ width: 100, height: 100, crop: true })
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

    if (!post) {
      res.status(404)

      throw new Error(`${req.originalUrl} ${global.dictionary.messages.notFound}`)
    } else {
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
    }
  })
}

export default new PostController()
