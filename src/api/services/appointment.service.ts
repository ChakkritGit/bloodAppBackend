import { Prisma, tb_apptransact } from '@prisma/client'
import prisma from '../../configs/prisma'
import {
  AppointmentRequestBody,
  UpdateAppointmentBody
} from '../../validators/appointment.validator'
import { v4 as uuidv4 } from 'uuid'
import { HttpError } from '../../types/global'
import { startOfDay, endOfDay } from 'date-fns'
import { getDateFormat } from '../../utils/date.format'
import { ProcessedFiles } from '../../types/appoinetmentType'
import {
  deleteFile,
  deleteMultipleFiles,
  getFileUrl
} from '../../utils/multer.config'

type AppointmentWithGroupedFiles = Omit<tb_apptransact, 'files'> & {
  files: {
    appointment?: any
    slip?: any
    testListDocs: any[]
    bloodTubes: any[]
    others?: any[]
  }
}

export const getAllAppointmentIdService = async (): Promise<
  tb_apptransact[] | null
> => {
  try {
    const result = await prisma.tb_apptransact.findMany()

    return result
  } catch (error) {
    throw error
  }
}

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

export const getAppointmentQueueTodayService = async (): Promise<
  {
    f_appadmindueque: number | null
  }[]
> => {
  try {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    const result = await prisma.tb_apptransact.findMany({
      where: {
        f_appcreatedatetime: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      select: {
        f_appidno: true,
        f_appadmindueque: true
      }
    })

    return result
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
        f_appstepno: 1,
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
        f_appcreatedatetime: getDateFormat(new Date()),
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

export const updateAppointmentService = async (
  appId: string
): Promise<tb_apptransact | null> => {
  try {
    const findAppoientment = await prisma.tb_apptransact.findUnique({
      where: { f_appidno: appId },
      include: { files: true }
    })

    if (!findAppoientment) {
      throw new HttpError(404, 'Appointment not found.')
    }

    const groupedFiles: AppointmentWithGroupedFiles['files'] = {
      appointment: null,
      slip: null,
      testListDocs: [],
      bloodTubes: [],
      others: []
    }

    findAppoientment.files.forEach(file => {
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

    if (groupedFiles.slip) {
      throw new HttpError(400, 'Cannot cancel appoientment.')
    }

    const result = await prisma.tb_apptransact.update({
      where: { f_appidno: appId },
      data: {
        f_appstepno: 5
      }
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updateAppointmentWithDocService = async (
  appointmentId: string,
  body: UpdateAppointmentBody,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const existingAppointment = await prisma.tb_apptransact.findUnique({
    where: { f_appidno: appointmentId },
    include: { files: true }
  })

  if (!existingAppointment) {
    throw new Error('Appointment not found')
  }

  const newFiles: ProcessedFiles = {}
  if (files.slipDoc) {
    newFiles.slipDocUrl = getFileUrl(files.slipDoc[0])
  }
  if (files.testListDocs) {
    newFiles.testListDocUrls = files.testListDocs.map(getFileUrl)
  }
  if (files.bloodTubes) {
    newFiles.bloodTubeUrls = files.bloodTubes.map(getFileUrl)
  }

  let newStep = existingAppointment.f_appstepno || 0

  if (body.f_appcreateconfirmname) {
    newStep = Math.max(newStep, 2)
  }

  if ((files.testListDocs && files.testListDocs.length > 0) || files.slipDoc) {
    newStep = Math.max(newStep, 4)
  }

  const dataToUpdate: Prisma.tb_apptransactUpdateInput = {
    ...body,
    f_appstepno: newStep
  }

  return prisma.$transaction(async tx => {
    if (body.removedImageIds && body.removedImageIds.length > 0) {
      const filesToDelete = existingAppointment.files.filter(f =>
        body.removedImageIds!.includes(f.f_appimageidno)
      )

      await deleteMultipleFiles(filesToDelete.map(f => f.f_appimageidpart))

      await tx.tb_apptransactfile.deleteMany({
        where: { f_appimageidno: { in: body.removedImageIds } }
      })
    }

    const fileCreationPromises: Prisma.PrismaPromise<any>[] = []

    if (newFiles.testListDocUrls) {
      newFiles.testListDocUrls.forEach(url => {
        if (url) {
          fileCreationPromises.push(
            tx.tb_apptransactfile.create({
              data: {
                f_appimageidno: `Image-${uuidv4()}`,
                f_appimageidpart: url,
                f_appimageidtype: 2,
                f_appimageidrefno: appointmentId
              }
            })
          )
        }
      })
    }
    if (newFiles.bloodTubeUrls) {
      newFiles.bloodTubeUrls.forEach(url => {
        if (url) {
          fileCreationPromises.push(
            tx.tb_apptransactfile.create({
              data: {
                f_appimageidno: `Image-${uuidv4()}`,
                f_appimageidpart: url,
                f_appimageidtype: 3,
                f_appimageidrefno: appointmentId
              }
            })
          )
        }
      })
    }
    if (newFiles.slipDocUrl) {
      const oldSlip = existingAppointment.files.find(
        f => f.f_appimageidtype === 4
      )
      if (oldSlip) {
        await deleteFile(oldSlip.f_appimageidpart)
        await tx.tb_apptransactfile.delete({
          where: { f_appimageidno: oldSlip.f_appimageidno }
        })
      }
      fileCreationPromises.push(
        tx.tb_apptransactfile.create({
          data: {
            f_appimageidno: `Image-${uuidv4()}`,
            f_appimageidpart: newFiles.slipDocUrl,
            f_appimageidtype: 4,
            f_appimageidrefno: appointmentId
          }
        })
      )
    }

    await Promise.all(fileCreationPromises)

    const updatedAppointment = await tx.tb_apptransact.update({
      where: { f_appidno: appointmentId },
      data: dataToUpdate
    })

    return updatedAppointment
  })
}
