import { NextFunction, Request, Response } from 'express'
import {
  AuthLoginBodySchema,
  AuthLoginRequestBody,
  AuthRegisterBodySchema,
  AuthRegisterRequestBody
} from '../../validators/auth.validator'
import { getUserService, loginService, registerService } from '../services/auth.service'

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const result = await getUserService()

    res.status(200).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams: AuthLoginRequestBody = AuthLoginBodySchema.parse(
      req.body
    )

    const result = await loginService(validatedParams)

    res.status(200).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams: AuthRegisterRequestBody =
      AuthRegisterBodySchema.parse(req.body)

    const result = await registerService(validatedParams)

    res.status(201).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
