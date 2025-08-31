import { NextFunction, Request, Response } from 'express'
import {
  AppointmentBodyParamsSchema,
  AppointmentIdParamsSchema,
  AppointmentRequestBody
} from '../../validators/appointment.validator'
import {
  createAppointmentService,
  getAllAppointmentIdService,
  getAppointmentIdService,
  searchAppointmentIdService,
  updateAppointmentService
} from '../services/appointment.service'
import { HttpError } from '../../types/global'
import { getFileUrl } from '../../utils/multer.config'

export const getAllAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllAppointmentIdService()

    res.status(200).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

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

export const searchAppointmentById = async (
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

    const result = await searchAppointmentIdService(validatedParams.data?.id)

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
  let appointmentDocUrl: string | null = ''

  try {
    const validatedBody: AppointmentRequestBody =
      AppointmentBodyParamsSchema.parse(req.body)

    if (req.files && !Array.isArray(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }

      const appointmentDocFile = files.appointmentDoc
        ? files.appointmentDoc[0]
        : null

      validatedBody.image = getFileUrl(appointmentDocFile)
    }

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

export const updateStatusAppointment = async (
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

    const result = await updateAppointmentService(validatedParams.data.id)

    res.status(201).json({
      message: 'Success',
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
