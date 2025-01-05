import mongoose from 'mongoose'
import { Locale, locale } from '../types/locale'

export interface ICategory extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  name: string
  parent_id: mongoose.Schema.Types.ObjectId
  order: number
  locale: Locale
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true, default: '-' },
  parent_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  order: { type: Number, default: 1 },
  locale: { type: String, required: true, default: locale.locales[0] },
})

const Category = mongoose.model<ICategory>('Category', categorySchema)

export default Category
