import 'dotenv/config'
import http from 'http'
import prisma from './configs/prisma'
import { logger } from './utils/logger'
import { config } from './configs'
import { app } from './app'
import { getProjectName } from './utils/project.name'

const PROJECT_NAME = getProjectName()
const TAG = 'Bootstrap'
const server = http.createServer(app)

const startServer = async () => {
  logger.separator(`STARTED (PID: ${process.pid}) for package ${PROJECT_NAME}`)

  try {
    await prisma.$connect()

    await new Promise<void>(resolve => {
      server.listen(config.port, () => {
        logger.info(TAG, `Server is running on http://localhost:${config.port}`)
        resolve()
      })
    })

    logger.info(TAG, 'Server started and ready.')
  } catch (error: any) {
    if (error.code && error.code.startsWith('P')) {
      logger.error(TAG, '❌ Failed to connect to the database:', error)
    } else {
      logger.error(TAG, '❌ Failed to start critical services:', error)
    }

    logger.separator(
      `ENDED ABNORMALLY (PID: ${process.pid}) for package ${PROJECT_NAME}`
    )
    process.exit(1)
  }
}

const gracefulShutdown = async (signal: string) => {
  logger.warn(TAG, `Received ${signal}. Starting graceful shutdown...`)

  const forceShutdownTimeout = setTimeout(() => {
    logger.error(TAG, 'Could not close connections in time, forcing shutdown.')
    logger.separator(
      `ENDED ABNORMALLY (PID: ${process.pid}) for package ${PROJECT_NAME}`
    )
    process.exit(1)
  }, 10000)

  server.close(async () => {
    logger.info(TAG, 'HTTP server closed.')

    await prisma.$disconnect()

    logger.separator(
      `ENDED GRACEFULLY (PID: ${process.pid}) for package ${PROJECT_NAME}`
    )

    clearTimeout(forceShutdownTimeout)
    process.exit(0)
  })
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

startServer()
