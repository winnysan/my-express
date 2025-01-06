import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import { ImageFormat, Mimetype } from '../types/enums'
import Message from './Message'

/**
 * Class for processing images, including resizing, format conversion, and saiving
 */
class ProcessImage {
  private file: Express.Multer.File
  private image: sharp.Sharp | null = null
  private format?: ImageFormat.JPEG | ImageFormat.PNG | ImageFormat.AVIF | ImageFormat.GIF

  /**
   * Initializes an instance of ProcessImage with the provided file
   * @param file
   */
  constructor(file: Express.Multer.File) {
    this.file = file

    if (
      [Mimetype.IMAGE_JPEG, Mimetype.IMAGE_PNG, Mimetype.IMAGE_AVIF, Mimetype.IMAGE_GIF].includes(
        this.file.mimetype as Mimetype
      )
    ) {
      const inputBuffer = fs.readFileSync(this.file.path)
      this.image = sharp(inputBuffer)
      this.format = this.file.mimetype.split('/')[1] as
        | ImageFormat.JPEG
        | ImageFormat.PNG
        | ImageFormat.AVIF
        | ImageFormat.GIF
    }
  }

  /**
   * Resizes the image based on provided options
   * @param options
   * @returns
   */
  public resize(options: sharp.ResizeOptions & { crop?: boolean }): ProcessImage {
    if (this.image) {
      const { crop, ...resizeOptions } = options

      if (crop) resizeOptions.fit = 'cover'

      this.image = this.image.resize(resizeOptions)
    }

    return this
  }

  /**
   * Converts the image to the specified format
   * @param options
   * @returns
   */
  public convert(options: {
    format?: ImageFormat.JPEG | ImageFormat.PNG | ImageFormat.AVIF | ImageFormat.GIF
    quality?: number
  }): ProcessImage {
    if (this.image) {
      this.format = options.format || this.format

      if (!this.format) return this

      switch (this.format) {
        case ImageFormat.JPEG:
          this.image = this.image.jpeg({ quality: options.quality })
          break
        case ImageFormat.PNG:
          this.image = this.image.png({ quality: options.quality })
          break
        case ImageFormat.AVIF:
          this.image = this.image.avif({ quality: options.quality })
          break
        case ImageFormat.GIF:
          this.image = this.image
          break
        default:
          break
      }

      this.file.mimetype = `image/${this.format}`
      const extMap = { jpeg: '.jpg', png: '.png', avif: '.avif', gif: '.gif' }
      const originalExt = path.extname(this.file.originalname)
      const newExt = extMap[this.format]
      this.file.originalname = this.file.originalname.replace(originalExt, newExt)
    }

    return this
  }

  /**
   * Saves the processed image bact to the file path
   * @returns
   */
  public async save(): Promise<Express.Multer.File> {
    if (this.image) {
      try {
        const buffer = await this.image.toBuffer()
        await fs.writeFile(this.file.path, buffer)

        return this.file
      } catch (err) {
        throw new Error(Message.getErrorMessage(err))
      }
    } else {
      return this.file
    }
  }

  /**
   * Saves the processed image to a specified target path
   * @param targetPath
   */
  public async saveAs(targetPath: string): Promise<Express.Multer.File> {
    if (this.image) {
      try {
        await this.image.toFile(targetPath)

        const newFile: Express.Multer.File = {
          ...this.file,
          path: targetPath,
          filename: path.basename(targetPath),
        }

        return newFile
      } catch (err) {
        throw new Error(Message.getErrorMessage(err))
      }
    } else {
      await fs.copyFile(this.file.path, targetPath)

      const newFile: Express.Multer.File = {
        ...this.file,
        path: targetPath,
        filename: path.basename(targetPath),
      }

      return newFile
    }
  }

  /**
   * Returns the file information
   * @returns
   */
  public getFile(): Express.Multer.File {
    return this.file
  }
}

export default ProcessImage
