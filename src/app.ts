import express from 'express'
import cors from 'cors'
import apiRoutes from './api/routes'
import httpLoggerMiddleware from './api/middlewares/httpLogger.middleware'
import { globalErrorHandler } from './api/middlewares/error.handler'

const app = express()

app.use(cors({ origin: process.env.FRONTENT_URL, credentials: true }))
app.use(express.json())
app.use(httpLoggerMiddleware)

app.use('/api', apiRoutes)

app.use(globalErrorHandler)

export { app }
