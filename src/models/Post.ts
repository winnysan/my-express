import mongoose from 'mongoose'

type Image = {
  uuid: string
  name: string
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
  createdAt: Date
  updatedAt: Date
}

const imageSchema = new mongoose.Schema<Image>({
  uuid: { type: String, required: true },
  name: { type: String, required: true },
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
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: undefined }],
  },
  { timestamps: true }
)

const Post = mongoose.model<IPost>('Post', postSchema)

export default Post
