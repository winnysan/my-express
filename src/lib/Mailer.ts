import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'
import Message from './Message'

interface MailOptions {
  from?: string
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  text: string
  html?: string
  attachments?: Array<{ filename: string; path: string }>
}

/**
 * The class responsible for processing mail
 */
class Mailer {
  private transporter: Transporter

  /**
   * Initialize Nodemailer transported
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: process.env.MAILER_SECURE === 'true',
      auth:
        process.env.MAILER_USER && process.env.MAILER_PASSWORD
          ? {
              user: process.env.MAILER_USER,
              pass: process.env.MAILER_PASSWORD,
            }
          : undefined,
    })
  }

  /**
   * Send mail
   * @param options
   * @returns
   */
  public send = async (options: MailOptions): Promise<SentMessageInfo> => {
    try {
      const info: SentMessageInfo = await this.transporter.sendMail({
        from: options.from || process.env.MAILER_FROM,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      })

      return info
    } catch (err: unknown) {
      throw new Error(Message.getErrorMessage(err))
    }
  }
}

export default Mailer
