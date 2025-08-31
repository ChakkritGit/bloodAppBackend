import { tb_apptransact } from '@prisma/client'
import prisma from '../../configs/prisma'
import { AppointmentRequestBody } from '../../validators/appointment.validator'
import { v4 as uuidv4 } from 'uuid'
import { HttpError } from '../../types/global'

type AppointmentWithGroupedFiles = Omit<tb_apptransact, 'files'> & {
  files: {
    appointment?: any
    slip?: any
    testListDocs: any[]
    bloodTubes: any[]
    others?: any[]
  }
}

export const getAppointmentIdService = async (
  appointmentId: string
): Promise<string | undefined> => {
  try {
    const result = await prisma.tb_apptransact.findUnique({
      where: { f_appidno: appointmentId },
      include: {
        files: true
      }
    })

    return result?.f_appidno ?? '-'
  } catch (error) {
    throw error
  }
}

export const searchAppointmentIdService = async (
  appointmentId: string
): Promise<AppointmentWithGroupedFiles | null> => {
  try {
    const result = await prisma.tb_apptransact.findUnique({
      where: { f_appidno: appointmentId },
      include: {
        files: true
      }
    })

    if (!result) throw new HttpError(404, 'Appointment number not found.')

    const groupedFiles: AppointmentWithGroupedFiles['files'] = {
      appointment: null,
      slip: null,
      testListDocs: [],
      bloodTubes: [],
      others: []
    }

    result.files.forEach(file => {
      switch (file.f_appimageidtype) {
        case 1:
          groupedFiles.appointment = file
          break
        case 4:
          groupedFiles.slip = file
          break
        case 2:
          groupedFiles.testListDocs.push(file)
          break
        case 3:
          groupedFiles.bloodTubes.push(file)
          break
        default:
          groupedFiles.others?.push(file)
          break
      }
    })

    return {
      ...result,
      files: groupedFiles
    }
  } catch (error) {
    throw error
  }
}

export const createAppointmentService = async (
  appointmentData: AppointmentRequestBody
): Promise<string | null> => {
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
            f_appimageidtype: 1
          }
        }
      }
    })
    return result.f_appidno
  } catch (error) {
    throw error
  }
}
