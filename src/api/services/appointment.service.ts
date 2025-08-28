import { tb_apptransact } from '@prisma/client'
import prisma from '../../configs/prisma'
import { HttpError } from '../../types/global'

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
