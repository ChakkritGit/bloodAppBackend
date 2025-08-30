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
import { getFileUrl } from '../../utils/multer.config'

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
    let appointmentDocUrl: string | null = null

    if (req.files && !Array.isArray(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }

      const appointmentDocFile = files.appointmentDoc
        ? files.appointmentDoc[0]
        : null

      appointmentDocUrl = getFileUrl(appointmentDocFile)
    }

    res.status(201).json({
      message: 'สร้างใบนัดหมายสำเร็จ',
      success: true,
      data: {
        files: {
          appointmentDoc: appointmentDocUrl
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
