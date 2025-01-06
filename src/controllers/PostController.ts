import { Request, Response } from 'express'
import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import AsyncHandler from '../lib/AsyncHandler'
import Helper from '../lib/Helper'
import ProcessImage from '../lib/ProcessImage'
import Category, { ICategory } from '../models/Category'
import Post from '../models/Post'
import { ImageFormat } from '../types/enums'

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
              uuid,
              name: file.originalname,
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
    })

    res.status(201).json({ message: 'ok', post })
  })
}

export default new PostController()
