import { Request, Response } from 'express'
import mongoose from 'mongoose'
import AsyncHandler from '../lib/AsyncHandler'
import Post, { IPost } from '../models/Post'
import { Role } from '../types/enums'

type DeleteResponse = {
  message: string
  data: { total: number }
}

enum LikesActions {
  LIKE = 'like',
  UNLIKE = 'unlike',
}

type LikeResponse = {
  message: string
  data: { likes: string[] }
}

/**
 * Api controller class for handling post-related operations
 */
class ApiPostController {
  /**
   * Delete post by ID
   */
  public deletePostById = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const post: IPost | null = await Post.findById(req.params.id)

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

    await post.deleteOne()

    const total = await Post.countDocuments({ author: req.session.user._id })

    const response: DeleteResponse = {
      message: global.dictionary.messages.postDeleted,
      data: { total },
    }

    res.status(200).json(response)
  })

  /**
   * Handle post likes
   */
  public handleLikes = AsyncHandler.wrap(async (req: Request, res: Response) => {
    const { data } = req.body

    const user = req.session.user?._id

    if (!user) {
      res.status(401)

      throw new Error(global.dictionary.messages.unauthorized)
    }

    if (!data || !data.action || !data.id)
      return res.status(400).json({ message: global.dictionary.messages.invalidData })

    switch (data.action) {
      case LikesActions.LIKE:
        await Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: user } }, { new: true })
        break
      case LikesActions.UNLIKE:
        await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: user } }, { new: true })
        break
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      res.status(400)

      throw new Error(global.dictionary.messages.unauthorized)
    }

    const likes: string[] = post.likes?.map(like => like.toString()) || []

    const response: LikeResponse = { message: global.dictionary.messages.saved, data: { likes } }

    res.status(200).json(response)
  })
}

export default new ApiPostController()
