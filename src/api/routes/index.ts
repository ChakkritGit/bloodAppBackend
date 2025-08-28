import express, { Request, Response, Router, NextFunction } from 'express'
import { BaseResponse } from '../../types/global'
import { config } from '../../configs'

const apiRoutes = Router()

apiRoutes.use('/auth', () => {})
apiRoutes.use(
  '/img',
  express.static(
    config.nodeEnv === 'development' ? 'src/public/images' : 'public/images'
  )
)
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
