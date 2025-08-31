import express from 'express'
import cors from 'cors'
import apiRoutes from './api/routes'
import httpLoggerMiddleware from './api/middlewares/httpLogger.middleware'
import { globalErrorHandler } from './api/middlewares/error.handler'
import { config } from './configs'

const app = express()

app.use(
  cors({ origin: [String(config.frontEndUrl), 'http://192.168.0.128:3007', 'http://192.168.1.223:3007'] })
)
app.use(express.json())
app.use(httpLoggerMiddleware)

app.use('/api', apiRoutes)

app.use(globalErrorHandler)

export { app }
