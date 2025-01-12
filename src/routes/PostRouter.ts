import express from 'express'
import PostController from '../controllers/PostController'
import AuthMiddleware from '../middlewares/AuthMiddleware'
import ValidationMiddleware from '../middlewares/ValidationMiddleware'

/**
 * Router for handling post-related routes
 */
class PostRouter {
  public router: express.Router

  /**
   * Initializes a new instance of the Router and sets up the routes
   */
  constructor() {
    this.router = express.Router()
    this.setRoutes()
  }

  /**
   * Defines and sets the routes
   */
  private setRoutes(): void {
    /**
     * Post page
     */
    this.router.get('/', PostController.postsPage)

    /**
     * New post page
     */
    this.router.get('/new', AuthMiddleware.protect, PostController.newPostPage)
    this.router.post('/new', AuthMiddleware.protect, ValidationMiddleware.post, PostController.newPost)

    /**
     * Post by slug
     */
    this.router.get('/:slug', PostController.getPostBySlug)

    /**
     * Edit post
     */
    this.router.post('/edit/:id', AuthMiddleware.protect, ValidationMiddleware.post, PostController.editPost)
  }
}

export default new PostRouter().router
