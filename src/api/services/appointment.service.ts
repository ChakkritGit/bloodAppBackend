import { tb_apptransact } from '@prisma/client'
import prisma from '../../configs/prisma'
import { AppointmentRequestBody } from '../../validators/appointment.validator'
import { v4 as uuidv4 } from 'uuid'

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
    const {
      f_appcreatebyname,
      f_appcreatecontactaddress,
      f_appcreatecontactlat,
      f_appcreatecontactlon,
      f_appcreatecontacttelephone,
      f_appcreatecontacttelephonetwo,
      f_appcreateforhn,
      f_appcreateforname,
      f_appdoctorduedate,
      f_appidno,
      f_apppictureappdoc,
      image
    } = appointmentData

    const UUID = `Image-${uuidv4()}`
    const result = await prisma.tb_apptransact.create({
      data: {
        f_appidno: f_appidno as string,
        f_appcreatebyname,
        f_appcreatecontactaddress,
        f_appcreatecontactlat,
        f_appcreatecontactlon,
        f_appcreatecontacttelephone,
        f_appcreatecontacttelephonetwo,
        f_appcreateforhn,
        f_appcreateforname,
        f_appdoctorduedate,
        f_apppictureappdoc,
        files: {
          create: {
            f_appimageidno: UUID,
            f_appimageidpart: image,
          }
        }
      }
    })
    return result
  } catch (error) {
    throw error
  }
}
