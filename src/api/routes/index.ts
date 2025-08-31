import express, { Request, Response, Router, NextFunction } from 'express'
import { BaseResponse } from '../../types/global'
import { config } from '../../configs'
import appointment from './appointment.route'
import auth from './auth.route'

const apiRoutes = Router()

apiRoutes.use('/images', express.static('public/images'))
apiRoutes.use('/auth', auth)
apiRoutes.use('/appointment', appointment)
apiRoutes.use(
  '/',
  (_req: Request, res: Response<BaseResponse>, _next: NextFunction) => {
    res.status(404).json({
      message: 'Not Found',
      success: false,
      data: null
    })
  }
)

export default apiRoutes
