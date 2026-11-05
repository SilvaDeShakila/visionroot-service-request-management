import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { env } from './config/env.js'
import authRouter from './routes/auth.routes.js'
import serviceRequestRouter from './routes/service-request.routes.js'
import {
  errorHandler,
  notFoundHandler,
} from './middleware/error.middleware.js'

const app = express()

app.disable('x-powered-by')

app.use(helmet())

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
  }),
)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/requests', serviceRequestRouter)

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'VisionRoot Service Request API is running.',
    timestamp: new Date().toISOString(),
  })
})

app.use(notFoundHandler)
app.use(errorHandler)

export default app
