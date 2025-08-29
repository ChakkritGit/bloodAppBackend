import { NextFunction, Request, Response } from 'express'
import {
  AppointmentBodyParamsSchema,
  AppointmentIdParamsSchema,
  AppointmentRequestBody
} from '../../validators/appointment.validator'
import {
  createAppointmentService,
  getAppointmentIdService
} from '../services/appointment.service'
import { HttpError } from '../../types/global'

export const findAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams = AppointmentIdParamsSchema.safeParse(req.params)

    if (validatedParams.error) {
      const firstIssue = validatedParams.error.issues[0]
      const message = firstIssue.message

      throw new HttpError(403, message)
    }

    const result = await getAppointmentIdService(validatedParams.data?.id)

    res.status(200).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedBody: AppointmentRequestBody =
      AppointmentBodyParamsSchema.parse(req.body)

    const result = await createAppointmentService(validatedBody)

    res.status(201).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
