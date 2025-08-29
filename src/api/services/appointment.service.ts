import { tb_apptransact } from '@prisma/client'
import prisma from '../../configs/prisma'
import { HttpError } from '../../types/global'
import { AppointmentRequestBody } from '../../validators/appointment.validator'

export const getAppointmentIdService = async (
  appointmentId: string
): Promise<tb_apptransact | null> => {
  try {
    const result = await prisma.tb_apptransact.findUnique({
      where: { f_appidno: appointmentId }
    })

    return result
  } catch (error) {
    throw error
  }
}

export const createAppointmentService = async (
  appointmentData: AppointmentRequestBody
): Promise<tb_apptransact | null> => {
  try {
    
    return null
  } catch (error) {
    throw error
  }
}
