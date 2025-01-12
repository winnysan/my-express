import mongoose from 'mongoose'
import { Locale, locale } from '../types/locale'

type Image = {
  originalname: string
  uuid: string
  extension: string
  mime: string
  size: number
  createdAt: Date
}

export interface IPost extends mongoose.Document {
  author: mongoose.Types.ObjectId
  title: string
  body: string
  slug: string
  images: Image[]
  categories?: mongoose.Types.ObjectId[]
  locale: Locale
  createdAt: Date
  updatedAt: Date
}

const imageSchema = new mongoose.Schema<Image>({
  originalname: { type: String, required: true },
  uuid: { type: String, required: true },
  extension: { type: String, required: true },
  mime: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

const postSchema = new mongoose.Schema<IPost>(
  {
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    images: [imageSchema],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: undefined }],
    locale: { type: String, required: true, default: locale.locales[0] },
  },
  { timestamps: true }
)

postSchema.index({ author: 1 })
postSchema.index({ categories: 1 })
postSchema.index({ locale: 1 })
postSchema.index({ createdAt: 1 })
postSchema.index({ title: 'text', body: 'text' })

const Post = mongoose.model<IPost>('Post', postSchema)

export default Post
