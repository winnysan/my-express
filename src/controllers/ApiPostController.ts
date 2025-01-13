import { Request, Response } from 'express'
import AsyncHandler from '../lib/AsyncHandler'
import Post, { IPost } from '../models/Post'
import { Role } from '../types/enums'

type DeleteResponse = {
  message: string
  data: { total: number }
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
}

export default new ApiPostController()
