import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const uploadDirectory = path.resolve(
  process.cwd(),
  'uploads',
  'avatars',
)

const allowedTypes: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    mkdirSync(uploadDirectory, { recursive: true })
    callback(null, uploadDirectory)
  },

  filename: (_req, file, callback) => {
    const extension = allowedTypes[file.mimetype]
    callback(null, `${randomUUID()}${extension}`)
  },
})

export const avatarUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    callback(null, Boolean(allowedTypes[file.mimetype]))
  },
}).single('avatar')