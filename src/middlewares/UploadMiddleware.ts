import multer from 'multer'

/**
 * Multer middleware for handling file uploads
 */
const upload = multer({ dest: 'temp/' })

export default upload
