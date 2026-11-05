import app from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

async function startServer(): Promise<void> {
  try {
    await connectDatabase()

    const server = app.listen(env.PORT, () => {
      console.info(`Server is running on http://localhost:${env.PORT}`)
      console.info(`Environment: ${env.NODE_ENV}`)
    })

    const shutdown = (signal: string): void => {
      console.info(`${signal} received. Shutting down server...`)

      server.close(() => {
        console.info('HTTP server closed.')
        process.exit(0)
      })
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (error) {
    console.error('Server startup failed:', error)
    process.exit(1)
  }
}

void startServer()
